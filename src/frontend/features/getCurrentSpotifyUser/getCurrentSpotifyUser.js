import axios from "axios";
import spotifyConfig from "config/spotify.config";

const getCurrentSpotifyUser = async (accessToken) => {
  if (accessToken) {
    var http = axios.create({
      baseURL: spotifyConfig.baseUrl,
      headers: { Authorization: "Bearer " + accessToken }
    });

    const response = await http.get("/me").catch((error) => {
      console.error(error);
    });
    return response.data;
  }
};

export { getCurrentSpotifyUser };
