import axios from "axios";

const getMusicSessions = async (spotifyUserId) => {
  const response = await axios.get(
    process.env.VUE_APP_APIURL + "/music_session",
    {
      params: { spotifyUserId },
      withCredentials: true
    }
  );

  return response.data;
};

export { getMusicSessions };
