import spotifyConfig from "config/spotify.config";
import AccessToken from "../../../classes/AccessToken";
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

    const accessToken = new AccessToken(response.data);

    cookieHandler(cookies).setAccessTokenCookie(accessToken);

    /*
    spotifyClient.setAccessToken(cookies.get("spotify_access_token"));
    
    const spotifyUser = await spotifyClient.getCurrentUser();
    await apiClient.saveUser(spotifyUser.id);
*/

    await saveSpotifyUser(apiUrl, accessToken.value);
    router.push("/host");
  } else {
    redirectToSpotifyLogin(baseUrl);
  }
};

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

async function saveUser(spotifyUserId, apiUrl) {
  const http = axios.create({
    withCredentials: true,
    baseURL: apiUrl
  });

  await http.post("/user", {
    spotifyUserId
  });
}

export { spotifyAuthorizeController };
