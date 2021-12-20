const axios = require("axios");
const spotifyConfig = require("../../../config/spotify.config");
const { ExternalRequestError } = require("../../errors/ExternalRequestError");
const { MissingParamError } = require("../../errors/MissingParamError");

const searchSpotify = async (query, limit, offset, type, accessToken) => {
    if (!query || !query.length) {
        throw new MissingParamError("no query");
    }

    const response = await axios.get(spotifyConfig.baseUrl + "search", {
        params: {
            q: query,
            type: type || "track,album",
            limit,
            offset
        },
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).catch((error) => {
        throw new ExternalRequestError(error.response)
    });

    return response.data;
};

module.exports = { searchSpotify };