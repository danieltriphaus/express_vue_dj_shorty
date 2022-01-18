import spotifyConfig from "config/spotify.config";
import axios from "axios";
import { cookieHandler } from "../../helpers/cookieHandler";
import { saveSpotifyUser } from "./saveSpotifyUser";
import { nanoid } from "nanoid";

//ToDo: Refactor
const spotifyAuthorizeController = async (baseUrl, authCode, state, apiUrl, cookies, router) => {
    if (authCode) {
        const stateCookie = cookies.get("state");
        cookies.delete("state");

        if (state !== stateCookie) {
            router.push("/");
        } else {
            const response = await postAuthCode(authCode, apiUrl);

            const accessToken = response.data;

            cookieHandler(cookies).setAccessTokenCookie(accessToken);

            await saveSpotifyUser(apiUrl, accessToken.value);
            router.push("/host");
        }
    } else {
        redirectToSpotifyLogin(baseUrl);
    }

    async function postAuthCode(authCode) {
        const response = await axios
            .post(
                "/api/authorize",
                {
                    code: authCode,
                },
                { withCredentials: true }
            )
            .catch(() => {
                throw new Error("Spotify Authorization failed, check Server Logs");
            });

        return response;
    }

    function redirectToSpotifyLogin(baseUrl) {
        const stateToken = nanoid();

        const oauth_redirect_url =
            spotifyConfig.authorization.baseUrl +
            spotifyConfig.authorization.endpoint +
            "?" +
            new URLSearchParams({
                client_id: spotifyConfig.clientId,
                response_type: "code",
                redirect_uri: baseUrl + spotifyConfig.authorization.redirectEndpoint,
                state: stateToken,
                scope: "playlist-modify-public",
            });

        document.cookie = "state=" + stateToken;
        window.location.assign(oauth_redirect_url);
    }
};

export { spotifyAuthorizeController };
