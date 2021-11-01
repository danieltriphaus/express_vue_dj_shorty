const axios = require("axios");
const AccessToken = require("../../classes/AccessToken.js");

module.exports = class AccessTokenRefresher {
  constructor({ refreshToken, spotifyConfig }) {
    this.refreshToken = refreshToken;
    this.spotifyConfig = spotifyConfig;
  }

  async getRefreshedAccessToken() {
    const response = await axios({
      method: "POST",
      url:
        this.spotifyConfig.authorization.baseUrl +
        this.spotifyConfig.authorization.tokenEndpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            this.spotifyConfig.clientId + ":" + this.spotifyConfig.clientSecret
          ).toString("base64")
      },
      data: encodeURI(
        "grant_type=refresh_token&refresh_token=" + this.refreshToken.value
      )
    });

    return new AccessToken({
      value: response.data.access_token,
      expiresIn: response.data.expires_in
    });
  }
};
