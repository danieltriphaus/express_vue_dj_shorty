import axios from "axios";
import spotifyConfig from "config/spotify.config";

const defaultViewData = { display_name: "" };

const getCurrentSpotifyUser = async (accessToken) => {
    if (accessToken) {
        return await getCurrentUserFromSpotify(accessToken);
    } else {
        return defaultViewData;
    }

    async function getCurrentUserFromSpotify(accessToken) {
        const response = await axios
            .get(spotifyConfig.baseUrl + "me", { headers: { Authorization: "Bearer " + accessToken } })
            .catch(async (error) => {
                if (isAccessTokenRevoked(error)) {
                    await deleteAuthCookiesViaApi();
                } else {
                    throw error;
                }
            });

        if (response) {
            return response.data;
        }
    }

    async function deleteAuthCookiesViaApi() {
        await axios.delete(process.env.VUE_APP_APIURL + "/authorize", { withCredentials: true });
    }

    function isAccessTokenRevoked(error) {
        return error.response && error.response.status === 401;
    }
};

export { getCurrentSpotifyUser };
