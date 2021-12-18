const express = require("express");
const { restart } = require("nodemon");
const { datastoreHandler } = require("../datastore/datastoreHandler");
const { decryptGuestAccessToken } = require("../features/guestAccessToken/decryptGuestAccessToken");
const { getGuestAccessToken } = require("../features/guestAccessToken/getGuestAccessToken");
const { enforceAddTrackDelay } = require("../features/addTrackDelay/enforceAddTrackDelay");
const { addTrack } = require("../features/track/addTrack");
const { AddTrackDelayError } = require("../errors/AddTrackDelayError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");
const { searchSpotify } = require("../features/track/searchSpotify");
const { EntityNotFoundError } = require("../errors/EntityNotFoundError");
const { MissingParamError } = require("../errors/MissingParamError");

const router = express.Router({mergeParams: true});

let musicSession;

router.all("/", async function(req, res, next) {
    try {
        let guestSpotifyAccessToken;
        const dh = datastoreHandler();
        musicSession = await dh.getMusicSession(req.params.spotifyUserId, req.params.musicSessionId);

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

router.get("/", async function (req, res) {
    try {
        const results = await searchSpotify(
            req.query.q,
            req.query.limit,
            req.query.offset,
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

router.post("/", async function(req, res) {
    try {
        const trackDelay = enforceAddTrackDelay(
            req.headers["x-forwarded-for"].split(",")[0] || req.socket.remoteAddress,
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

module.exports = router;