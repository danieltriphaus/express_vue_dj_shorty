import axios from "axios";

const getMusicSessions = async (spotifyUserId) => {
  const response = await axios.get(
    process.env.VUE_APP_APIURL +"/user/" + spotifyUserId + "/music_session",
    {
      withCredentials: true
    }
  );

  return response.data;
};

export { getMusicSessions };
