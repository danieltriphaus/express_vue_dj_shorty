var express = require("express");
var router = express.Router();
var config = require("../../config/spotify.config");
var AccessToken = require("../lib/classes/AccessToken");

var cookieParser = require("cookie-parser");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var Authorize = require("../controllers/Authorize");
var AccessTokenRefresher = require("../controllers/AccessTokenRefresher");

router.use(express.json());
router.use(cookieParser());

router.post("/", async function (req, res) {
  let authorize = new Authorize({
    code: req.body.code,
    baseURL: process.env.VUE_APP_BASEURL,
    spotifyConfig: config
  });

  await authorize.requestSpotifyOauthTokens().catch((error) => {
    console.log(error.response);
    res.statusCode = error.response.status;

    res.json({
      apiResponse:
        "Failed Spotify Request, check logs for full Spotify Request",
      spotifyResponseData: error.response.data
    });
  });

  const accessToken = authorize.getAccessToken();
  /*
    res.cookie("spotify_access_token", accessToken.value, {
      maxAge: accessToken.expiresIn,
      path: "/"
    });
*/
  res.setHeader("Set-Cookie", [
    "spotify_access_token=" +
      accessToken.value +
      "; Max-Age=" +
      accessToken.expiresIn +
      "; Path=/"
  ]);

  const refreshToken = authorize.getRefreshToken();
  /*
    res.cookie("spotify_refresh_token", refreshToken.value, {
      maxAge: refreshToken.expiresIn,
      path: "/",
      secure: true,
      httpOnly: true
    });
*/
  res.setHeader("Set-Cookie", [
    "spotify_refresh_token=" +
      refreshToken.value +
      "; Max-Age=" +
      refreshToken.expiresIn +
      "; Path=/; HttpOnly; Secure;"
  ]);

  res.end();
});

router.get("/", async function (req, res) {
  const refresher = new AccessTokenRefresher({
    refreshToken: new AccessToken({ value: req.cookies.spotify_refresh_token }),
    spotifyConfig: config
  });

  const accessToken = await refresher
    .getRefreshedAccessToken()
    .catch((error) => {
      console.log(error.response);
      res.statusCode = error.response.status;

      res.json({
        apiResponse:
          "Failed Spotify Request, check logs for full Spotify Request",
        spotifyResponseData: error.response.data
      });
    });

  res.json(accessToken);

  res.end();
});

module.exports = router;
