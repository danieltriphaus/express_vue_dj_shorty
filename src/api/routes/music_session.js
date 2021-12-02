var express = require("express");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { MissingParamError } = require("../errors/MissingParamError");
const { createNewMusicSession } = require("../features/musicSession/createNewMusicSession");
const { getMusicSessions } = require("../features/musicSession/getMusicSessions");
const { changeMusicSession } = require("../features/musicSession/changeMusicSession");

var router = express.Router({mergeParams: true});

router.post("/", async (req, res) => {
  try {
    const musicSession = await createNewMusicSession({
      ...req.body.musicSession,
      spotifyUserId: req.params.spotifyUserId,
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
      req.params.spotifyUserId,
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


router.patch("/:musicSessionId", async (req, res) => {
  try {
    const changedMusicSession = await changeMusicSession(
      req.params.spotifyUserId,
      req.params.musicSessionId,
      req.body
    );
    res.status(200).json({musicSession: changedMusicSession});
  } catch(error) {
    if (error instanceof InvalidTokenError) {
      res.status(403).json(error.message);
    } else if (error instanceof MissingParamError) {
      res.status(404).json(error.message);
    } else {
      throw error
    }
  }
});
module.exports = router;
