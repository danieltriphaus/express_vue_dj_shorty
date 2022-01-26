import axios from "axios";

const getMusicSessions = async (spotifyUserId) => {
    const response = await axios.get("/api/user/" + spotifyUserId + "/music_session", {
        withCredentials: true,
    });

    return response.data;
};

export { getMusicSessions };
