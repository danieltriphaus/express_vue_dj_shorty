var express = require("express");
var { saveUser } = require("../features/saveUser/saveUser");
var { saveUserDatastore } = require("../features/saveUser/saveUserDatastore");
var { datastoreHandler } = require("../datastore/datastoreHandler");
const { saveDevice } = require("../features/device/saveDevice");

var router = express.Router();

router.post("/", async (req, res) => {
  try {
    await saveDevice(
      req.body.spotifyUserId,
      req.cookies.device_id,
      req.cookies.spotify_refresh_token
    );
  } catch(error) {
    console.error(error);
    res.status(500).json(error.message);
  }

  res.status(200).end();
});

module.exports = router;
