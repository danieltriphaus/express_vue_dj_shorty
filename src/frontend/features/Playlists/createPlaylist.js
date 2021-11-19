import axios from "axios";
import spotifyConfig from "config/spotify.config";

const createPlaylist = async (accessToken, spotifyUserId, name) => {
  if (name) {
    await axios.post(
      spotifyConfig.baseUrl + "users/" + spotifyUserId + "/playlists",
      {
        name,
        description:
          "Created By DJ-Shorty at: " + new Date().toLocaleDateString()
      },
      {
        withCredentials: false,
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      }
    );
  }
};

export { createPlaylist };
