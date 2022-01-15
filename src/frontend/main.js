import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookie from "vue-cookie";
import Toasted from "vue-toasted";

import { spotifyAccessToken } from "./plugins/spotifyAccessToken";

import "bootstrap/js/dist/button";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/global.css";

Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(spotifyAccessToken, { cookie: VueCookie , router});
Vue.use(Toasted);

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
