import axios from "axios";
import { cookieHandler } from "../../helpers/cookieHandler";

const getAccessTokenController = async (apiUrl, cookies) => {
  const ch = cookieHandler(cookies);

  if (ch.isAccessTokenCookieSet()) {
    return ch.getAccessToken();
  } else {
    try {
      const accessToken = await refreshAccessToken(apiUrl);
      ch.setAccessTokenCookie(accessToken);
      return accessToken.value;
    } catch (error) {
      console.error(error);
    }
  }
};

async function refreshAccessToken(apiUrl) {
  var http = axios.create({
    withCredentials: true,
    baseURL: apiUrl
  });

  const response = await http.get(apiUrl + "/authorize").catch(() => {
    throw new Error("Spotify Token Refresh failed, Check Server Logs");
  });

  return response.data ? response.data : "";
}

export { getAccessTokenController };
