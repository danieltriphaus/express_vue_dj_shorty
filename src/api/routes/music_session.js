var express = require("express");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { MissingParamError } = require("../errors/MissingParamError");
const { createNewMusicSession } = require("../features/musicSession/createNewMusicSession");
const { getMusicSessions } = require("../features/musicSession/getMusicSessions");
const { changeMusicSession } = require("../features/musicSession/changeMusicSession");
const { authenticateDevice } = require("../middleware/authenticateDevice");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");
const { EntityNotFoundError } = require("../errors/EntityNotFoundError");
const { getMusicSession } = require("../features/musicSession/getMusicSession");

var router = express.Router({ mergeParams: true });

const restrictedMethods = ["POST", "PATCH", "PUT", "DELETE"];

router.all("/", async (req, res, next) => {
    try {
        if (restrictedMethods.indexOf(req.method) >= 0) {
            await authenticateDevice(
                req.params.spotifyUserId,
                req.cookies.device_id,
                req.cookies.spotify_refresh_token
            );
        }
        next();
    } catch (error) {
        handleErrors(error, req, res);
    }
});

router.post("/", async (req, res) => {
    try {
        const musicSession = await createNewMusicSession({
            ...req.body.musicSession,
            spotifyUserId: req.params.spotifyUserId,
            spotifyRefreshToken: req.cookies.spotify_refresh_token,
        });

        res.status(200).json(musicSession);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

router.get("/", async (req, res) => {
    try {
        const musicSessions = await getMusicSessions(req.params.spotifyUserId);
        res.status(200).json(musicSessions);
    } catch (error) {
        handleErrors(error, req, res);
    }

    res.end();
});

router.get("/:musicSessionId", async function (req, res) {
    try {
        const musicSession = await getMusicSession(req.params.spotifyUserId, req.params.musicSessionId);

        res.status(200).json(musicSession);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

router.patch("/:musicSessionId", async (req, res) => {
    try {
        const changedMusicSession = await changeMusicSession(
            req.params.spotifyUserId,
            req.params.musicSessionId,
            req.body
        );
        res.status(200).json({ musicSession: changedMusicSession });
    } catch (error) {
        handleErrors(error, req, res);
    }
});

module.exports = router;

function handleErrors(error, req, res) {
    if (error instanceof InvalidTokenError) {
        res.status(403).json(error.message);
    } else if (error instanceof MissingParamError) {
        res.status(404).json(error.message);
    } else if (error instanceof NotAuthorizedError) {
        res.status(401).json(error.message);
    } else if (error instanceof EntityNotFoundError) {
        res.status(404).json(error.message);
    } else if (error instanceof ExternalRequestError) {
        req.log.error(error);
        res.status(error.response.status).json(error.message);
    } else {
        req.log.error(error);
        throw error;
    }

    res.end();
}
