import axios from "axios";
import AccessToken from "../classes/AccessToken";

export default {
  install(Vue, { apiUrl }) {
    this.apiUrl = apiUrl;
    axios.defaults.withCredentials = true;

    Vue.prototype.$apiClient = this;
  },

  async refreshAccessToken() {
    const response = await axios.get(this.apiUrl + "/authorize").catch(() => {
      throw new Error("Spotify Token Refresh failed, Check Server Logs");
    });

    return new AccessToken(response.data);
  }
};
