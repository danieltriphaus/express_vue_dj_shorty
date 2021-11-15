import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";

const getCurrentUser = {
  install(Vue) {
    Vue.prototype.$getCurrentSpotifyUser = async (accessToken) => {
      return await getCurrentSpotifyUser(accessToken);
    };
  }
};

export { getCurrentUser };
