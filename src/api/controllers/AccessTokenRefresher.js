const axios = require("axios");

module.exports.AccessTokenRefresher = (refreshToken, spotifyConfig) => {
  return {
    async getRefreshedAccessToken() {
      const response = await axios({
        method: "POST",
        url:
          spotifyConfig.authorization.baseUrl +
          spotifyConfig.authorization.tokenEndpoint,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              spotifyConfig.clientId + ":" + spotifyConfig.clientSecret
            ).toString("base64")
        },
        data: encodeURI(
          "grant_type=refresh_token&refresh_token=" + refreshToken
        )
      }).catch((error) => {
        throw new Error(error);
      });

      return {
        value: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    }
  };
};
