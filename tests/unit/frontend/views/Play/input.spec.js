import { render, screen, waitFor, fireEvent } from "@testing-library/vue";
import axios from "axios";
import "@testing-library/jest-dom";
import { helpers, TEXTS } from "./helpers";

import Play from "@/frontend/views/Play";

jest.mock("axios");

describe("Play View user input tests", () => {
    const searchResults = {
        tracks: {
            items: [
                {
                    id: "1",
                    name: "Track 01",
                    artists: [{ name: "Artist 01" }],
                    album: {
                        images: [{ url: "" }, { url: "" }],
                    },
                },
                {
                    id: "2",
                    name: "Track 02",
                    artists: [{ name: "Artist 02" }],
                    album: {
                        images: [{ url: "" }, { url: "" }],
                    },
                },
            ],
            limit: 5,
            offset: 0,
        },
        albums: {
            items: [
                {
                    id: "3",
                    name: "Album 01",
                    artists: [{ name: "Artist 01" }],
                    images: [{ url: "" }, { url: "" }],
                },
                {
                    id: "4",
                    name: "Album 02",
                    artists: [{ name: "Artist 02" }],
                    images: [{ url: "" }, { url: "" }],
                },
            ],
            limit: 5,
            offset: 0,
        },
    };

    it("should send search query", async () => {
        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: {} });

        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(axios.get).toBeCalledWith(
                expect.stringContaining(""),
                expect.objectContaining({
                    params: expect.objectContaining({
                        q: "Test Query",
                    }),
                })
            );
        });
    });

    it("should display search results", async () => {
        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: searchResults });

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));
        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(screen.getByText(searchResults.tracks.items[0].name)).toBeVisible();
        });
    });

    it("should blur input after track was added", async () => {
        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router }, (vue) => {
            vue.prototype.$toasted = { show: jest.fn() };
        });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: searchResults });

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));
        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(screen.getByText(searchResults.tracks.items[0].name)).toBeVisible();
        });

        axios.post.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({ data: {} });

        await fireEvent.click(screen.getAllByTestId("add-button")[0]);

        await waitFor(() => {
            expect(screen.getByText(TEXTS.addSongs, { exact: false })).toBeVisible();
        });
    });

    it("should blur and empty input after track was added", async () => {
        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router }, (vue) => {
            vue.prototype.$toasted = { show: jest.fn() };
        });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: searchResults });

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));
        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(screen.getByText(searchResults.tracks.items[0].name)).toBeVisible();
        });

        axios.post.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({ data: {} });

        await fireEvent.click(screen.getAllByTestId("add-button")[0]);

        await waitFor(() => {
            expect(screen.getByText(TEXTS.addSongs, { exact: false })).toBeVisible();
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder).value).toBe("");
        });
    });

    it("should load more songs on click", async () => {
        const moreSongs = {
            tracks: {
                items: [
                    {
                        id: "11",
                        name: "Track 10",
                        artists: [{ name: "Artist 10" }],
                        album: {
                            images: [{ url: "" }, { url: "" }],
                        },
                    },
                    {
                        id: "21",
                        name: "Track 02",
                        artists: [{ name: "Artist20" }],
                        album: {
                            images: [{ url: "" }, { url: "" }],
                        },
                    },
                ],
                limit: 5,
                offset: 0,
            },
        };

        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: searchResults });

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));
        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(screen.getByText(searchResults.tracks.items[0].name)).toBeVisible();
        });

        axios.get.mockResolvedValueOnce({ data: moreSongs });

        await fireEvent.click(screen.getByText(TEXTS.moreSongs));

        await waitFor(() => {
            expect(axios.get).toBeCalledWith(
                expect.stringContaining(""),
                expect.objectContaining({
                    params: expect.objectContaining({
                        q: "Test Query",
                        offset: 5,
                        type: "track",
                    }),
                })
            );
        });

        await waitFor(() => {
            expect(screen.getByText(moreSongs.tracks.items[0].name)).toBeVisible();
        });
    });

    it("should load more albums on click", async () => {
        const moreAlbums = {
            albums: {
                items: [
                    {
                        id: "10",
                        name: "Album 10",
                        artists: [{ name: "Artist 10" }],
                        images: [{ url: "" }, { url: "" }],
                    },
                    {
                        id: "20",
                        name: "Album 02",
                        artists: [{ name: "Artist20" }],
                        images: [{ url: "" }, { url: "" }],
                    },
                ],
                limit: 5,
                offset: 0,
            },
        };

        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });

        render(Play, { routes: router });

        await helpers.assertPlaylistNameRendered();

        axios.get.mockResolvedValueOnce({ data: searchResults });

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));
        await fireEvent.update(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder), "Test Query");

        await waitFor(() => {
            expect(screen.getByText(searchResults.albums.items[0].name)).toBeVisible();
        });

        axios.get.mockResolvedValueOnce({ data: moreAlbums });

        await fireEvent.click(screen.getByText(TEXTS.moreAlbums));

        await waitFor(() => {
            expect(axios.get).toBeCalledWith(
                expect.stringContaining(""),
                expect.objectContaining({
                    params: expect.objectContaining({
                        q: "Test Query",
                        offset: 5,
                        type: "album",
                    }),
                })
            );
        });

        await waitFor(() => {
            expect(screen.getByText(moreAlbums.albums.items[0].name)).toBeVisible();
        });
    });
});
