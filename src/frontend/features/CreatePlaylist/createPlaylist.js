import axios from "axios";
import spotifyConfig from "config/spotify.config";

const createPlaylist = async (accessToken, spotifyUserid, name) => {
  await axios.create().post(
    spotifyConfig.baseUrl + "users/" + spotifyUserid + "/playlists",
    {
      name,
      description: "Created By DJ-Shorty at: " + new Date().toLocaleDateString()
    },
    {
      withCredentials: false,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    }
  );
};

export { createPlaylist };
