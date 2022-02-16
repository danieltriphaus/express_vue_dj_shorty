import axios from "axios";
import { getCurrentSpotifyUser } from "../getCurrentSpotifyUser/getCurrentSpotifyUser";

const saveSpotifyUser = async (apiUrl, accessToken) => {
    const spotifyUser = await getCurrentSpotifyUser(accessToken);

    await axios.post(
        "/api/user",
        {
            spotifyUserId: spotifyUser.id,
        },
        { withCredentials: true }
    );
};

export { saveSpotifyUser };
