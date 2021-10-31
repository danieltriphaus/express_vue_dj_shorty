let axios = require("axios");
let AccessToken = require("../lib/classes/AccessToken");

module.exports = class Authorize {
  _refreshTokenExpiresIn = 10 * 365 * 24 * 60 * 60;

  constructor({ code, spotifyConfig, baseURL }) {
    this.code = code;
    this.spotifyConfig = spotifyConfig;
    this.baseURL = baseURL;
  }

  async requestSpotifyOauthTokens() {
    const spotifyResponse = await this._requestAccessTokensFromSpotify();

    this._setTokensFromResponseData(spotifyResponse.data);
  }

  async _requestAccessTokensFromSpotify() {
    const spotifyResponse = await axios(
      this.spotifyConfig.authorization.baseUrl +
        this.spotifyConfig.authorization.tokenEndpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              this.spotifyConfig.clientId +
                ":" +
                this.spotifyConfig.clientSecret
            ).toString("base64")
        },
        data: encodeURI(
          "grant_type=" +
            this.spotifyConfig.authorization.grantType +
            "&code=" +
            this.code +
            "&redirect_uri=" +
            this.baseURL +
            this.spotifyConfig.authorization.redirectEndpoint
        )
      }
    );

    if (spotifyResponse.status !== 200) {
      throw new Error("Spotify Error Response: " + spotifyResponse);
    }

    return spotifyResponse;
  }

  _setTokensFromResponseData(responseData) {
    this.accessToken = new AccessToken({
      value: responseData.access_token,
      expiresIn: responseData.expires_in
    });

    this.refreshToken = new AccessToken({
      value: responseData.refresh_token,
      expiresIn: this._refreshTokenExpiresIn
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }
};
