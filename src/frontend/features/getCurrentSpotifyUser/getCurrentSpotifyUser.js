import axios from "axios";
import spotifyConfig from "config/spotify.config";

const getCurrentSpotifyUser = async (accessToken) => {
  let viewData = { display_name: "" };

  if (accessToken) {
    var http = axios.create({
      baseURL: spotifyConfig.baseUrl,
      headers: { Authorization: "Bearer " + accessToken }
    });

    const response = await http.get("/me")
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          await axios.delete(process.env.VUE_APP_APIURL + "/authorize", { withCredentials: true });
        } else {
          throw error;
        }
      });

    viewData = response.data;
  }

  return viewData;
};

export { getCurrentSpotifyUser };
