var express = require("express");
var {
  createNewMusicSession
} = require("../features/musicSession/createNewMusicSession");

var router = express.Router();

router.post("/", async (req, res) => {
  const musicSession = await createNewMusicSession(
    req.body.musicSession,
    req.cookies.spotify_refresh_token
  );

  res.status(200).json(musicSession);
});

module.exports = router;
