import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookie from "vue-cookie";
import apiClient from "./plugins/apiClient";
import spotifyClient from "./plugins/spotifyClient";
import spotifyConfig from "config/spotify.config";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/global.css";

Vue.config.productionTip = false;

Vue.use(VueCookie);
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
