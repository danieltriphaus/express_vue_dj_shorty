import { render, waitFor, screen } from "@testing-library/vue";
import VueRouter from "vue-router";
import { nanoid } from "nanoid";
import "@testing-library/jest-dom";
import { spotifyAccessToken } from "@/frontend/plugins/spotifyAccessToken";
import { getAccessTokenController } from "@/frontend/features/GetAccessToken/getAccessToken";

import Host from "@/frontend/views/Host";
import axios from "axios";

jest.mock("axios");
jest.mock("@/frontend/features/GetAccessToken/getAccessToken");

describe("Host View Tests", () => {
    const fakeMusicSessions = [
        {
            id: nanoid(21),
            playlistName: "testPlaylist",
            status: "active",
            createdAt: new Date(),
        },
        {
            id: nanoid(21),
            playlistName: "testPlaylist2",
            status: "active",
            createdAt: new Date(),
        },
    ];

    it("should render musicSessions returned from api", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });

        await router.push("/host");

        axios.get.mockResolvedValueOnce({ data: fakeMusicSessions });

        render(Host, { routes: router }, (vue) => {
            vue.prototype.$getAccessToken = jest.fn();
        });
        fakeMusicSessions.forEach(async (musicSession) => {
            await waitFor(() => {
                expect(screen.getByText(musicSession.playlistName)).toBeVisible();
            });
        });
    });

    it("should redirect to / when access_token is invalid", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });
        await router.push("/host");
        axios.get.mockResolvedValueOnce({ data: fakeMusicSessions });

        getAccessTokenController.mockRejectedValueOnce();

        render(Host, { routes: router }, (vue) => {
            vue.use(spotifyAccessToken, { router });
        });

        await waitFor(() => {
            expect(router.currentRoute.path).toBe("/");
        });
    });

    it("should render spotify user display name returned from api", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });

        await router.push("/host");

        axios.get.mockResolvedValueOnce({ data: { display_name: "testUser" } });
        axios.get.mockResolvedValueOnce({ data: fakeMusicSessions });

        render(Host, { routes: router }, (vue) => {
            vue.prototype.$getAccessToken = jest.fn().mockResolvedValueOnce("test_access_token");
        });

        await waitFor(() => {
            expect(screen.getByText("testUser", { exact: false })).toBeVisible();
        });
    });
});
