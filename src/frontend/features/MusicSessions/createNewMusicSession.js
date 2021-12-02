import axios from "axios";

const createNewMusicSession = async (musicSession, spotifyUserId) => {
  const apiUrl = process.env.VUE_APP_APIURL;

  const response = await axios.post(
    apiUrl + "/user/" + spotifyUserId + "/music_session",
    { musicSession },
    { withCredentials: true }
  );

  return response.data.musicSession;
};

export { createNewMusicSession };
