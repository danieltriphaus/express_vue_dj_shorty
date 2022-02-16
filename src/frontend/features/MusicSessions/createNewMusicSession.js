import axios from "axios";

const createNewMusicSession = async (musicSession, spotifyUserId) => {
    const response = await axios.post(
        "/api/user/" + spotifyUserId + "/music_session",
        { musicSession },
        { withCredentials: true }
    );
    return response.data.musicSession;
};

export { createNewMusicSession };
