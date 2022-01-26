import axios from "axios";
import { cookieHandler } from "../../helpers/cookieHandler";

const getAccessTokenController = async (apiUrl, cookies) => {
    const ch = cookieHandler(cookies);

    if (ch.isAccessTokenCookieSet()) {
        return ch.getAccessToken();
    } else {
        const accessToken = await refreshAccessToken(apiUrl);
        ch.setAccessTokenCookie(accessToken);
        return accessToken.value;
    }
};

async function refreshAccessToken() {
    var http = axios.create({
        withCredentials: true,
    });

    const response = await http.get("/api/authorize").catch(async (error) => {
        if (error.response && error.response.status === 401) {
            await axios.delete("/api/authorize", { withCredentials: true });
        }
        throw new Error("Spotify Token Refresh failed, Check Server Logs");
    });

    return response.data ? response.data : "";
}

export { getAccessTokenController };
