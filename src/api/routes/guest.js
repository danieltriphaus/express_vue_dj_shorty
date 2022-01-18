const express = require("express");
const { enforceAddTrackDelay } = require("../features/addTrackDelay/enforceAddTrackDelay");
const { AddTrackDelayError } = require("../errors/AddTrackDelayError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");
const { searchSpotify } = require("../features/track/searchSpotify");
const { EntityNotFoundError } = require("../errors/EntityNotFoundError");
const { MissingParamError } = require("../errors/MissingParamError");
const { getAlbumTracks } = require("../features/album/getAlbumTracks");
const { addTrack } = require("../features/track/addTrack");
const { DecryptionError } = require("../errors/DecryptionError");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { authenticateGuest } = require("../middleware/authenticateGuest");

const router = express.Router({ mergeParams: true });

router.all("/*", async function (req, res, next) {
    try {
        await authenticateGuest(req, res);

        next();
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            req.bunyan.error(error);
            res.status(404).json(error.message);
        } else if (error instanceof DecryptionError) {
            res.status(400).json(error.message);
        } else if (error instanceof InvalidTokenError || error instanceof NotAuthorizedError) {
            res.status(401).json(error.message);
        } else {
            throw error;
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
            req.bunyan.error(error);
            res.status(400).json("external request failed");
        } else if (error instanceof EntityNotFoundError) {
            req.bunyan.error(error);
            res.status(404).json(error.message);
        } else if (error instanceof MissingParamError) {
            res.status(200).json({});
        } else {
            throw error;
        }
    }

    res.end();
});

router.post("/track", async function (req, res) {
    try {
        if (!isHost(req)) {
            const trackDelay = enforceAddTrackDelay(
                req.djShorty.spotifyAccessToken,
                req.djShorty.musicSession.id,
                req.djShorty.musicSession.waitTime
            );
            await trackDelay.checkGuestAccess();

            await trackDelay.updateTrackLastAdded();
        }

        await addTrack(
            req.body.spotifyTrackUri,
            req.djShorty.musicSession.spotifyPlaylistId,
            req.djShorty.spotifyAccessToken
        );

        res.status(200);
    } catch (error) {
        if (error instanceof AddTrackDelayError) {
            res.status(429).json(error.message);
        } else {
            throw error;
        }
    }

    res.end();
});

router.get("/album/:albumId/track", async function (req, res) {
    try {
        const albumTracks = await getAlbumTracks(req.params.albumId, req.djShorty.spotifyAccessToken);

        res.status(200).json(albumTracks);
    } catch (error) {
        if (error instanceof ExternalRequestError) {
            res.status(400).json("external request error");
        }
    }

    res.end();
});

module.exports = router;
