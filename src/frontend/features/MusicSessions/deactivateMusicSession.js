import axios from "axios";

const deactivateMusicSession = async (spotifyUserId, musicSessionId) => { 
    const response = await axios.patch(
        process.env.VUE_APP_APIURL + "/user/" + spotifyUserId + "/music_session/" + musicSessionId, 
        { status: "inactive" },
        { withCredentials: true }
    );

    return response.data.musicSession;
};

export { deactivateMusicSession }