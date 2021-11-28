import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookie from "vue-cookie";

import { spotifyAccessToken } from "./plugins/spotifyAccessToken";
import { getCurrentUser } from "./plugins/getCurrentSpotifyUser";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/global.css";



Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(spotifyAccessToken, { cookie: VueCookie });
Vue.use(getCurrentUser);

/*
Vue.use(apiClient, { apiUrl: process.env.VUE_APP_APIURL });
Vue.use(spotifyClient, {
  config: spotifyConfig,
  accessToken: VueCookie.get("spotify_access_token")
});
*/
new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
