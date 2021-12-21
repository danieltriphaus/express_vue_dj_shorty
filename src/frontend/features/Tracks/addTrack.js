import axios from "axios";
import { AddTrackDelayError } from "../../errors/AddTrackDelayError";

const addTrack = async (routeParams, spotifyTrackUri) => {
    await axios.post("/api/user/" + routeParams.userId 
        + "/music_session/" + routeParams.musicSessionId 
        + "/guest/track",{
            spotifyTrackUri: spotifyTrackUri
    }).catch((error) => {
        if (error.response && error.response.status === 429) {
            throw new AddTrackDelayError("attempted to add track before wait time elapsed");
        } else {
            throw error;
        }
    });

    return true;
};

export { addTrack }