import axios from "axios";
import spotifyConfig from "config/spotify.config";

const getPlaylists = async (accessToken) => {
    const response = await axios.create().get(spotifyConfig.baseUrl + "me/playlists", {
        withCredentials: false,
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export { getPlaylists };
