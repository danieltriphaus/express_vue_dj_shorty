var express = require("express");
var { saveUser } = require("../features/saveUser/saveUser");
var { saveUserDatastore } = require("../features/saveUser/saveUserDatastore");

var router = express.Router();

router.post("/", async (req, res) => {
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

module.exports = router;
