import SpotifyClient from "../../classes/SpotifyClient";

export default {
  install(Vue, { config, accessToken }) {
    Vue.prototype.$spotifyClient = new SpotifyClient({
      config,
      accessToken
    });
  }
};
