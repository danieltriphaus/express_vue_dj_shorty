import axios from "axios";
import { getCurrentSpotifyUser } from "../getCurrentSpotifyUser/getCurrentSpotifyUser";

const saveSpotifyUser = async (apiUrl, accessToken) => {
  const apiClient = axios.create({
    withCredentials: true,
    baseURL: apiUrl
  });

  const spotifyUser = await getCurrentSpotifyUser(accessToken);

  await apiClient.post("/user", {
    spotifyUserId: spotifyUser.id
  });
};

export { saveSpotifyUser };
