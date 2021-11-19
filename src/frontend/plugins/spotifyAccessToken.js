import { getAccessTokenController } from "../features/GetAccessToken/getAccessToken";

const spotifyAccessToken = {
  install(Vue, { cookie }) {
    Vue.prototype.$getAccessToken = async () => {
      return await getAccessTokenController(process.env.VUE_APP_APIURL, cookie);
    };
  }
};

export { spotifyAccessToken };
