var express = require("express");
var { saveUser } = require("../features/saveUser/saveUser");
var { saveUserDatastore } = require("../features/saveUser/saveUserDatastore");
var { datastoreHandler } = require("../datastore/datastoreHandler");
const { saveDevice } = require("../features/device/saveDevice");

var router = express.Router();

router.post("/nowhere", async (req, res) => {
  let datastore = await saveUserDatastore(
    req.body.spotifyUserId,
    req.headers["user-agent"],
    req.cookies.spotify_refresh_token
  );
  try {
    let device = await datastore.getDeviceFromDb();
    const su = saveUser(device);

    if (su.doesDeviceExist(req.cookies.spotify_refresh_token)) {
      datastore.transactionRollback();
    } else {
      await datastore.saveEntities();
    }
  } catch (err) {
    console.error(err);
    datastore.transactionRollback();
    res.status(500).json("datastore error");
  }

  res.statusCode = 200;
  res.end();
});

router.post("/", async (req, res) => {
  try {
    await saveDevice(
      req.body.spotifyUserId,
      req.headers["user-agent"],
      req.cookies.spotify_refresh_token
    );
  } catch(error) {
    console.error(error);
    res.status(500).json("datastore error");
  }

  res.status(200).end();
});

module.exports = router;
