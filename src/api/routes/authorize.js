var express = require("express");
var config = require("../../config/spotify.config");
var { Authorize } = require("../controllers/Authorize");
var { AccessTokenRefresher } = require("../controllers/AccessTokenRefresher");
const { nanoid } = require("nanoid");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { ExternalRequestError } = require("../errors/ExternalRequestError");

var router = express.Router();

router.post("/", async function (req, res) {
    try {
        let authorize = Authorize({
          code: req.body.code,
          baseURL: process.env.VUE_APP_BASEURL,
          spotifyConfig: config
        });

        await authorize.requestSpotifyOauthTokens();

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
            "; Path=/; Secure; HttpOnly",
          
          "device_id=" +
            nanoid(21) +
            "; Max-Age=" + 
            refreshToken.expiresIn +
            "; Path=/; Secure; HttpOnly"
        ]);

        res.status(200).json(accessToken);
    } catch(error) {
        if (error instanceof ExternalRequestError) {
            req.log.error(error);
            res.status(400).json("external request failed");
        }
    }

  res.end();
});

router.get("/", async function (req, res) {
  try {
    const refresher = AccessTokenRefresher(
      req.cookies.spotify_refresh_token,
      config
    );

    const accessToken = await refresher.getRefreshedAccessToken();

    res.status(200).json(accessToken);
    
  } catch (error) {
    if (error instanceof InvalidTokenError || error instanceof NotAuthorizedError) {
      res.status(401).json(error.message);
    } else {
      req.log.error(error);
      res.status(500).json(error.message);
      res.end();
    }
  }

  res.end();
});

router.delete("/", function(req, res) {
  res.setHeader("Set-Cookie", [
    "spotify_access_token= ;expires=Thu, Jan 01 1970 00:00:00 UTC; Path=/;",
    "spotify_refresh_token= ;expires=Thu, Jan 01 1970 00:00:00 UTC; Path=/;",
    "device_id= ;expires=Thu, Jan 01 1970 00:00:00 UTC; Path=/;",
  ]);

  res.status(200).json("Authorization Cookies deleted");
});

module.exports = router;
