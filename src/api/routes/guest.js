const express = require("express");
const { datastoreHandler } = require("../datastore/datastoreHandler");
const { decryptGuestAccessToken } = require("../features/guestAccessToken/decryptGuestAccessToken");
const { getGuestAccessToken } = require("../features/guestAccessToken/getGuestAccessToken");
const { enforceAddTrackDelay } = require("../features/addTrackDelay/enforceAddTrackDelay");
const { AddTrackDelayError } = require("../errors/AddTrackDelayError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");
const { searchSpotify } = require("../features/track/searchSpotify");
const { EntityNotFoundError } = require("../errors/EntityNotFoundError");
const { MissingParamError } = require("../errors/MissingParamError");
const { getAlbumTracks } = require("../features/album/getAlbumTracks");

const router = express.Router({mergeParams: true});



router.all("/*", async function(req, res, next) {
    try {
        let guestSpotifyAccessToken;
        const dh = datastoreHandler();
        const musicSession = await dh.getMusicSession(req.params.spotifyUserId, req.params.musicSessionId);

        if (!req.cookies.spotify_access_token) {
            const spotifyAccessTokenCookie = await getGuestAccessToken(musicSession.refreshToken, musicSession.encryptionKey);

            res.setHeader("Set-Cookie", 
                "spotify_access_token=" +
                spotifyAccessTokenCookie.value +
                "; Max-Age=" +
                spotifyAccessTokenCookie.expiresIn +
                "; Path=/; Secure; HttpOnly;"
            )

            guestSpotifyAccessToken = spotifyAccessTokenCookie.value;
        } else {
            guestSpotifyAccessToken = req.cookies.spotify_access_token;
        }

        const spotifyAccessToken = decryptGuestAccessToken(guestSpotifyAccessToken, musicSession.encryptionKey);

        req.djShorty = { spotifyAccessToken, musicSession };

        next();
    } catch(error) {
        if (error instanceof EntityNotFoundError) {
            console.error(error);
            res.status(404).json(error.message);
        } else {
            throw error
        }
    }
});

router.get("/search", async function (req, res) {
    try {
        const results = await searchSpotify(
            req.query.q,
            req.query.limit,
            req.query.offset,
            req.query.type,
            req.djShorty.spotifyAccessToken
        );

        res.status(200).json(results);
    } catch (error) {
        if (error instanceof ExternalRequestError) {
            console.error(error);
            res.status(400).json("external request failed");
        } else if (error instanceof EntityNotFoundError) {
            console.error(error);
            res.status(404).json(error.message);
        } else if (error instanceof MissingParamError) {
            res.status(200).json({});
        } else {
            throw error
        }
    }

    res.end();
});

router.post("/track", async function(req, res) {
    try {
        const trackDelay = enforceAddTrackDelay(
            req.djShorty.spotifyAccessToken,
            req.djShorty.musicSession.id,
            req.djShorty.musicSession.waitTime
        ); 
        await trackDelay.checkGuestAccess();

        await trackDelay.updateTrackLastAdded();
    } catch(error) {
        if (error instanceof AddTrackDelayError) {
            res.status(429).json(error.message);
        } else {
            throw error;
        }
    }

    res.end();
});

router.get("/album/:albumId/track", async function(req, res) {
    try {
        const albumTracks = await getAlbumTracks(req.params.albumId, req.djShorty.spotifyAccessToken );
        
        res.status(200).json(albumTracks);
    } catch(error) {
        if (error instanceof ExternalRequestError) {
            res.status(400).json("external request error");
        }
    }

    res.end();
});

module.exports = router;