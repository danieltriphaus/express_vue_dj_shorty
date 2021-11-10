var axios = require("axios");

module.exports = class SpotifyClient {
  constructor({ config, accessToken }) {
    this.config = config;
    this.accessToken = accessToken;
    this._initAxios();
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    this._initAxios();
  }

  _initAxios() {
    this.axios = axios.create({
      withCredentials: false,
      baseURL: this.config.baseUrl,
      headers: { Authorization: "Bearer " + this.accessToken }
    });
  }

  async getCurrentUser() {
    const response = await this.axios.get("/me").catch((error) => {
      console.error(error);
    });
    return response.data;
  }
};
