import spotifyConfig from "config/spotify.config";
import axios from "axios";
import { cookieHandler } from "../../helpers/cookieHandler";
import { saveSpotifyUser } from "./saveSpotifyUser";

const spotifyAuthorizeController = async (
  baseUrl,
  authCode,
  apiUrl,
  cookies,
  router
) => {
  if (authCode) {
    const response = await postAuthCode(authCode, apiUrl);

    const accessToken = response.data;

    cookieHandler(cookies).setAccessTokenCookie(accessToken);

    await saveSpotifyUser(apiUrl, accessToken.value);
    router.push("/host");
  } else {
    redirectToSpotifyLogin(baseUrl);
  }
};

async function postAuthCode(authCode, apiUrl) {
  const http = axios.create({
    withCredentials: true,
    baseURL: apiUrl
  });

  const response = await http
    .post("/authorize", {
      code: authCode
    })
    .catch((error) => {
      throw new Error("Spotify Authorization failed, check Server Logs");
    });

  return response;
}

function redirectToSpotifyLogin(baseUrl) {
  const oauth_redirect_url =
    spotifyConfig.authorization.baseUrl +
    spotifyConfig.authorization.endpoint +
    "?" +
    new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: "code",
      redirect_uri: baseUrl + spotifyConfig.authorization.redirectEndpoint,
      //ToDo: state: CSRF Token
      scopes: "playlist-modify-public"
    });

  window.location.assign(oauth_redirect_url);
}

export { spotifyAuthorizeController };
