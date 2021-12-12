const axios = require("axios");
const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");

module.exports.AccessTokenRefresher = (refreshToken, spotifyConfig) => {
  if (!refreshToken || refreshToken.length === 0) {
    throw new InvalidTokenError("User not logged in");
  }

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
        if (error.response && error.response.status === 400) {
          throw new NotAuthorizedError(error.response.data.error_description);
        } else {
          throw new Error(error);
        }
      });

      return {
        value: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    }
  };
};
