import axios from "axios";

export default {
  install(Vue, { apiUrl }) {
    this.apiUrl = apiUrl;
    this.axios = axios.create({
      withCredentials: true,
      baseURL: this.apiUrl
    });

    Vue.prototype.$apiClient = this;
  },

  async saveUser(spotifyUserId) {
    await this.axios.post("/user", {
      spotifyUserId
    });
  },

  async postAuthCode(authCode) {
    const response = await this.axios
      .post("/authorize", {
        code: authCode
      })
      .catch((error) => {
        throw new Error("Spotify Authorization failed, check Server Logs");
      });

    return response;
  }
};
