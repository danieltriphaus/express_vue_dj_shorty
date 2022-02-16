import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/vue";
import axios from "axios";
import "@testing-library/jest-dom";
import { helpers } from "./helpers";

import Play from "@/frontend/views/Play";

jest.mock("axios");

const TEXTS = {
    searchInputPlaceholder: "Suche Songs auf Spotify",
    missingSession: "Music Session ist inaktiv oder existiert nicht",
    addSongs: "Füge Songs zur Playlist",
};

describe("Play View rendering tests", () => {
    it("should render playlistName", async () => {
        const router = helpers.getRouter();

        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });
        render(Play, { routes: router });
        await helpers.assertPlaylistNameRendered();
    });

    it("should render message if musicSession is inactive or does not exist", async () => {
        const router = helpers.getRouter();

        axios.get.mockResolvedValueOnce({ data: {} });
        render(Play, { routes: router });
        await waitFor(() => {
            expect(screen.getByText(TEXTS.missingSession)).toBeVisible();
        });

        cleanup();

        axios.get.mockResolvedValueOnce({ data: { ...helpers.testMusicSession, status: "inactive" } });
        render(Play, { routes: router });
        await waitFor(() => {
            expect(screen.getByText(TEXTS.missingSession)).toBeVisible();
        });

        cleanup();

        axios.get.mockRejectedValueOnce({ response: { status: 404 } });
        render(Play, { routes: router });
        await waitFor(() => {
            expect(screen.getByText(TEXTS.missingSession)).toBeVisible();
        });
    });

    it("should render message only if input is unfocused", async () => {
        const router = helpers.getRouter();
        axios.get.mockResolvedValueOnce({ data: helpers.testMusicSession });
        render(Play, { routes: router });

        await helpers.assertPlaylistNameRendered();

        await fireEvent.focus(screen.getByPlaceholderText(TEXTS.searchInputPlaceholder));

        await waitFor(() => {
            expect(screen.getByText(TEXTS.addSongs, { exact: false })).not.toBeVisible();
        });
    });
});
