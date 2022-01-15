import Vue from "vue";
import VueRouter from "vue-router";
const Index = () => import("../views/Index.vue");
const Authorize = () => import("../views/Authorize.vue");
const Host = () => import("../views/Host");
const NewMusicSession = () => import("../views/NewMusicSession");
const Play = () => import("../views/Play");

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
  },
  {
    path: "/new_music_session",
    name: "new_music_session",
    component: NewMusicSession
  },
  {
    path: "/play/:userId/:musicSessionId",
    name: "play",
    component: Play
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
