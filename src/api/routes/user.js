var express = require("express");
const { saveDevice } = require("../features/device/saveDevice");

var router = express.Router();

router.post("/", async (req, res) => {
  try {
    await saveDevice(
      req.body.spotifyUserId,
      req.cookies.device_id,
      req.cookies.spotify_refresh_token
    );

    res.status(200).end();
  } catch(error) {
    req.log.error(error);
    res.status(500).json(error.message);
  }
});

module.exports = router;
