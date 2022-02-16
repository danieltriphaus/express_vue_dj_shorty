import { render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import VueRouter from "vue-router";
import { spotifyAccessToken } from "@/frontend/plugins/spotifyAccessToken";
import { getAccessTokenController } from "@/frontend/features/GetAccessToken/getAccessToken";

import Index from "@/frontend/views/Index";

jest.mock("@/frontend/features/GetAccessToken/getAccessToken");

describe("Index View Tests", () => {
    it("should redirect to authorize if code is in url", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });

        await router.push({ path: "/", query: { code: "test_auth_code" } });

        render(Index, { routes: router }, (vue) => {
            vue.prototype.$getAccessToken = jest.fn();
        });

        await waitFor(() => {
            expect(router.currentRoute).toMatchObject({ path: "/authorize", query: { code: "test_auth_code" } });
        });
    });

    it("should redirect to host when access token gets returned", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });

        await router.push("/");
        getAccessTokenController.mockResolvedValueOnce("test_access_token");

        render(Index, { routes: router }, (vue) => {
            vue.use(spotifyAccessToken, { router });
        });

        await waitFor(() => {
            expect(router.currentRoute.path).toBe("/host");
        });
    });
});
