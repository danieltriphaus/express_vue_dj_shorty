var express = require("express");
var { Datastore } = require("@google-cloud/datastore");

var router = express.Router();

router.post("/", async (req, res) => {
  const datastore = new Datastore();

  const key = datastore.key(["user", req.body.spotifyUserId]);

  let [user] = await datastore.get(key);

  user = {
    key,
    data: {
      spotifyUserId: req.body.spotifyUserId,
      refreshToken: req.cookies.spotify_refresh_token
    }
  };

  await datastore.upsert(user);

  res.statusCode = 200;
  res.end();
});

module.exports = router;
