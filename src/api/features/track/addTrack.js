const { MissingParamError } = require("../../errors/MissingParamError");
const spotifyConfig = require("../../../config/spotify.config");
const axios = require("axios");
const { ExternalRequestError } = require("../../errors/ExternalRequestError");

const addTrack = async (spotifyTrackUri, spotifyPlaylistId, spotifyAccessToken) => {
    if (!spotifyTrackUri) {
        throw new MissingParamError("spotifyTrackUri is missing");
    }

    await axios.post(spotifyConfig.baseUrl + "playlists/" + spotifyPlaylistId + "/tracks", {
        uris: [ spotifyTrackUri ]
    }, {
        headers: {
            "Authorization": "Bearer " + spotifyAccessToken
        }
    }).catch((error) => {
        throw new ExternalRequestError(error.response);
    });
};

module.exports = { addTrack };
