var express = require("express");
var config = require("../../config/spotify.config");
var { Authorize } = require("../controllers/Authorize");
var { AccessTokenRefresher } = require("../controllers/AccessTokenRefresher");

var router = express.Router();

router.post("/", async function (req, res) {
  let authorize = Authorize({
    code: req.body.code,
    baseURL: process.env.VUE_APP_BASEURL,
    spotifyConfig: config
  });

  await authorize.requestSpotifyOauthTokens().catch((error) => {
    res.respondWithFailedSpotifyRequest(error);
    res.end();
  });

  const accessToken = authorize.getAccessToken();
  const refreshToken = authorize.getRefreshToken();

  res.setHeader("Set-Cookie", [
    "spotify_access_token=" +
      accessToken.value +
      "; Max-Age=" +
      accessToken.expiresIn +
      "; Path=/",

    "spotify_refresh_token=" +
      refreshToken.value +
      "; Max-Age=" +
      refreshToken.expiresIn +
      "; Path=/; HttpOnly; Secure;"
  ]);

  res.json(accessToken);

  res.end();
});

router.get("/", async function (req, res) {
  if (req.cookies.spotify_refresh_token) {
    const refresher = AccessTokenRefresher(
      req.cookies.spotify_refresh_token,
      config
    );
    const accessToken = await refresher
      .getRefreshedAccessToken()
      .catch(res.respondWithFailedSpotifyRequest);

    res.json(accessToken);

    res.end();
  } else {
    res.status(403).json("user not logged in");
    res.end();
  }
});

module.exports = router;
