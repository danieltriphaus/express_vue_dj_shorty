var express = require("express");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { MissingParamError } = require("../errors/MissingParamError");
const { createNewMusicSession } = require("../features/musicSession/createNewMusicSession");
const { getMusicSessions } = require("../features/musicSession/getMusicSessions");

var router = express.Router();

router.post("/", async (req, res) => {
  try {
    const musicSession = await createNewMusicSession({
      ...req.body.musicSession,
      spotifyRefreshToken: req.cookies.spotify_refresh_token,
    });

    res.status(200).json(musicSession);
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      res.status(403).json(error.message);
    } else {
      throw error;
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const musicSessions = await getMusicSessions(
      req.query.spotifyUserId,
      req.cookies.spotify_refresh_token,
      req.headers["user-agent"]
    );

    res.status(200).json(musicSessions);
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      res.status(403).json(error.message);
    } else if (error instanceof MissingParamError) {
      res.status(404).json(error.message);
    } else {
      throw error
    }
  }

  res.end();
});

module.exports = router;
