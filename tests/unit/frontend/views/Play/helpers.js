import { waitFor, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import VueRouter from "vue-router";

export const helpers = {
    testMusicSession: {
        id: "musicSessionId",
        playlistName: "testPlaylist",
        status: "active",
    },

    getRouter() {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });
        router.push("/play/testUser/musicSessionId");
        return router;
    },

    async assertPlaylistNameRendered() {
        await waitFor(() => {
            // eslint-disable-next-line no-undef
            expect(screen.getByText("testPlaylist")).toBeVisible();
        });
    },
};

export const TEXTS = {
    searchInputPlaceholder: "Suche Songs auf Spotify",
    missingSession: "Music Session ist inaktiv oder existiert nicht",
    addSongs: "Füge Songs zur Playlist",
    moreSongs: "Mehr Songs",
    moreAlbums: "Mehr Alben",
};
