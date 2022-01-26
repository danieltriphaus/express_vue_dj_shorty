import { getAccessTokenController } from "../features/GetAccessToken/getAccessToken";

const spotifyAccessToken = {
    install(Vue, { cookie, router }) {
        Vue.prototype.$getAccessToken = async () => {
            try {
                return await getAccessTokenController(process.env.VUE_APP_APIURL, cookie);
            } catch (error) {
                router.currentRoute.path !== "/" ? router.push("/") : undefined;
            }
        };
    },
};

export { spotifyAccessToken };
