import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookie from "vue-cookie";
import apiClient from "./plugins/apiClient";

Vue.config.productionTip = false;

Vue.use(VueCookie);
Vue.use(apiClient, { apiUrl: process.env.VUE_APP_APIURL });

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
