import axios from "axios";

const createNewMusicSession = async (musicSessionParams, spotifyUserId) => {
  const apiUrl = process.env.VUE_APP_APIURL;

  const response = await axios.post(
    apiUrl + "/music_session",
    {
      musicSession: {
        ...musicSessionParams,
        spotifyUserId
      }
    },
    { withCredentials: true }
  );

  return response.data.musicSession;
};

export { createNewMusicSession };
