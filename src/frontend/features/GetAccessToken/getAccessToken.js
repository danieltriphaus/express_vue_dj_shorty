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

async function refreshAccessToken(apiUrl) {
  var http = axios.create({
    withCredentials: true,
    baseURL: apiUrl
  });

  const response = await http.get(apiUrl + "/authorize").catch(async (error) => {
    if (error.response && error.response.status === 401) {
      await axios.delete(process.env.VUE_APP_APIURL + "/authorize", { withCredentials: true });
    }
    throw new Error("Spotify Token Refresh failed, Check Server Logs");
  });

  return response.data ? response.data : "";
}

export { getAccessTokenController };
