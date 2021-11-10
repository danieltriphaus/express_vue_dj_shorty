import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import Authorize from "../views/Authorize.vue";
import Host from "../views/Host";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index
  },
  {
    path: "/authorize",
    name: "authorize",
    component: Authorize
  },
  {
    path: "/host",
    name: "host",
    component: Host
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
