let axios = require("axios");
const { ExternalRequestError } = require("../errors/ExternalRequestError");

//ToDo: refactor
module.exports.Authorize = ({ code, spotifyConfig, baseURL }) => {
    const refreshTokenExpiresIn = 10 * 365 * 24 * 60 * 60;
    let accessToken = "";
    let refreshToken = "";

    async function _requestAccessTokensFromSpotify() {
        const spotifyResponse = await axios(
            spotifyConfig.authorization.baseUrl + spotifyConfig.authorization.tokenEndpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(spotifyConfig.clientId + ":" + spotifyConfig.clientSecret).toString("base64"),
                },
                data: encodeURI(
                    "grant_type=" +
                        spotifyConfig.authorization.grantType +
                        "&code=" +
                        code +
                        "&redirect_uri=" +
                        baseURL +
                        spotifyConfig.authorization.redirectEndpoint
                ),
            }
        ).catch((error) => {
            throw new ExternalRequestError(error.response);
        });

        return spotifyResponse;
    }

    function _setTokensFromResponseData(responseData) {
        accessToken = {
            value: responseData.access_token,
            expiresIn: responseData.expires_in,
        };

        refreshToken = {
            value: responseData.refresh_token,
            expiresIn: refreshTokenExpiresIn,
        };
    }

    return {
        async requestSpotifyOauthTokens() {
            const spotifyResponse = await _requestAccessTokensFromSpotify();

            _setTokensFromResponseData(spotifyResponse.data);
        },

        getAccessToken() {
            return accessToken;
        },

        getRefreshToken() {
            return refreshToken;
        },
    };
};
