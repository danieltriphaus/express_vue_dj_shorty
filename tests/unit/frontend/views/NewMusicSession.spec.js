import { render, screen, waitFor, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";
import VueRouter from "vue-router";
import axios from "axios";
import { nanoid } from "nanoid";

import NewMusicSession from "@/frontend/views/NewMusicSession";

jest.mock("axios");

describe("NewMusicSession View tests", () => {
    const fakePlaylists = {
        items: [
            {
                id: nanoid(),
                name: "testPlaylist 1",
                tracks: { total: 21 },
            },
            {
                id: nanoid(),
                name: "testPlaylist 2",
                tracks: { total: 45 },
            },
        ],
    };

    it("should show playlist names and track totals from api", async () => {
        mockGetPlaylistRequest();

        const router = getRouter();
        renderView(router);

        await assertPlaylistsRendered(fakePlaylists);

        await waitFor(() => {
            fakePlaylists.items.forEach((playlist) => {
                expect(screen.getByText("Tracks: " + playlist.tracks.total)).toBeVisible();
            });
        });
    });

    it("should create create new playlist on click", async () => {
        mockGetPlaylistRequest();
        axios.get.mockResolvedValueOnce({ data: { id: "testUser" } });

        const router = getRouter();
        renderView(router, "access_token");

        await assertPlaylistsRendered(fakePlaylists);

        mockGetPlaylistRequest(fakePlaylists);

        axios.post.mockImplementationOnce((url, playlistParams) => {
            addNewFakePlaylist(playlistParams.name);
        });

        await fireEventsForCreatePlaylist();

        await waitFor(() => {
            expect(axios.post).toBeCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByText(fakePlaylists.items[fakePlaylists.items.length - 1].name)).toBeVisible();
        });

        fakePlaylists.items.pop();
    });

    it("should create new music session with input", async () => {
        mockGetPlaylistRequest();
        const newMusicSession = { id: nanoid() };
        mockCreateMusicSession(newMusicSession);

        const router = getRouter();
        renderView(router);

        await assertPlaylistsRendered();
        await userInputForCreateMusicSession(3);

        expect(axios.post).toReturnWith({
            data: {
                musicSession: {
                    ...newMusicSession,
                    waitTime: "3",
                    spotifyPlaylistId: fakePlaylists.items[0].id,
                    playlistName: fakePlaylists.items[0].name,
                },
            },
        });

        expect(router.currentRoute.path).toBe("/host");
    });

    it("should create new music session with input without waitTime", async () => {
        mockGetPlaylistRequest();
        const newMusicSession = { id: nanoid() };
        mockCreateMusicSession(newMusicSession);

        const router = getRouter();
        renderView(router);

        await assertPlaylistsRendered();
        await userInputForCreateMusicSession();

        expect(axios.post).toReturnWith({
            data: {
                musicSession: {
                    ...newMusicSession,
                    waitTime: 0,
                    spotifyPlaylistId: fakePlaylists.items[0].id,
                    playlistName: fakePlaylists.items[0].name,
                },
            },
        });

        expect(router.currentRoute.path).toBe("/host");
    });

    function mockGetPlaylistRequest() {
        axios.create.mockReturnValueOnce({
            get: jest.fn().mockResolvedValue({ data: fakePlaylists }),
        });
    }

    function getRouter() {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });
        router.push("/new_music_session");
        return router;
    }

    function renderView(router, accessToken) {
        render(NewMusicSession, { routes: router }, addAccessTokenPlugin(accessToken));
    }

    function addAccessTokenPlugin(returnValue) {
        return (vue) => {
            vue.prototype.$getAccessToken = jest.fn().mockResolvedValueOnce(returnValue);
        };
    }

    async function fireEventsForCreatePlaylist() {
        await fireEvent.click(screen.getByText("Neue Playlist erstellen"));
        await waitFor(() => {
            expect(screen.getByPlaceholderText("Namen eingeben")).toBeVisible();
        });

        await fireEvent.update(screen.getByPlaceholderText("Namen eingeben"), { target: { value: "Test Playlist 3" } });
        await fireEvent.click(screen.getByTestId("create-playlist"));
    }

    function addNewFakePlaylist(name) {
        fakePlaylists.items.push({
            id: nanoid(),
            name: name,
            tracks: { total: 32 },
        });
    }

    async function userInputForCreateMusicSession(waitTime) {
        await fireEvent.update(screen.getByLabelText("Wartezeit"), waitTime);
        await fireEvent.click(screen.getByLabelText(fakePlaylists.items[0].name, { exact: false }));
        await fireEvent.click(screen.getByText("Erstellen"));
    }

    async function assertPlaylistsRendered() {
        await waitFor(() => {
            fakePlaylists.items.forEach((playlist) => {
                expect(screen.getByText(playlist.name)).toBeVisible();
            });
        });
    }

    function mockCreateMusicSession(newMusicSession) {
        axios.post.mockImplementationOnce((url, musicSession) => {
            return { data: { musicSession: { ...newMusicSession, ...musicSession.musicSession } } };
        });
    }
});
