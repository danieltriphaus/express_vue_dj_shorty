const axios = require("axios");
const spotifyConfig = require("../../../config/spotify.config");
const { ExternalRequestError } = require("../../errors/ExternalRequestError");


const getAlbumTracks = async (albumId, spotifyAccessToken) => {
    const response = await axios.get(spotifyConfig.baseUrl + "albums/" + albumId + "/tracks", {
        headers: {
            "Authorization": "Bearer " + spotifyAccessToken
        },
        params: {
            market: "DE"
        }
    }).catch((error) => {
        throw new ExternalRequestError(error.response)
    });

    return response.data;
};

module.exports = { getAlbumTracks };