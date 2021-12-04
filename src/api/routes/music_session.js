var express = require("express");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { MissingParamError } = require("../errors/MissingParamError");
const { createNewMusicSession } = require("../features/musicSession/createNewMusicSession");
const { getMusicSessions } = require("../features/musicSession/getMusicSessions");
const { changeMusicSession } = require("../features/musicSession/changeMusicSession");
const { authenticateSpotifyUser } = require("../middleware/authenticateSpotifyUser");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");

var router = express.Router({mergeParams: true});

router.all("/", async (req, res, next) => {
  try {
    await authenticateSpotifyUser(req.params.spotifyUserId, req.cookies.device_id, req.cookies.spotify_refresh_token);
  } catch(error) {
    handleErrors(error, res);
  }

  next();
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
    handleErrors(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const musicSessions = await getMusicSessions(
      req.params.spotifyUserId,
      req.cookies.spotify_refresh_token,
      req.cookies.device_id
    );

    res.status(200).json(musicSessions);
  } catch (error) {
    handleErrors(error, res);
  }

  res.end();
});


router.patch("/:musicSessionId", async (req, res) => {
  try {
    const changedMusicSession = await changeMusicSession(
      req.params.spotifyUserId,
      req.params.musicSessionId,
      req.body
    );
    res.status(200).json({musicSession: changedMusicSession});
  } catch(error) {
    handleErrors(error, res);
  }
});

module.exports = router;

function handleErrors(error, res) {
  if (error instanceof InvalidTokenError) {
    res.status(403).json(error.message);
  } else if (error instanceof MissingParamError) {
    res.status(404).json(error.message);
  } else if (error instanceof NotAuthorizedError) {
    res.status(401).json(error.message);
  } else if (error instanceof ExternalRequestError) {
    console.log(error);
    res.status(error.response.status).json(error.message);
  } else {
    console.log(error);
    throw error;
  }
}

