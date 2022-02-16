import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import SearchResultAlbum from "@/frontend/components/SearchResultAlbum";
import "@testing-library/jest-dom";
import axios from "axios";
import VueRouter from "vue-router";

jest.mock("axios");

describe("SearchResultTrack Component Tests", () => {
    const fakeAlbum = {
        name: "test Album",
        artists: [{ name: "Artist 01" }, { name: "Artist 02" }],
        images: [{ url: "#" }, { url: "#" }],
    };

    const fakeAlbumTracks = [
        {
            name: "test Track 01",
            artists: [{ name: "Artist 01" }, { name: "Artist 02" }],
        },
        {
            name: "test Track 02",
            artists: [{ name: "Artist 01" }],
        },
    ];

    it("should render album data", () => {
        render(SearchResultAlbum, { props: { album: fakeAlbum } });

        expect(screen.getByText(fakeAlbum.name)).toBeInTheDocument();
        expect(screen.getByText(fakeAlbum.artists[0].name + ", " + fakeAlbum.artists[1].name)).toBeInTheDocument();
    });

    it("should show tracks in drawer after clicked to open", async () => {
        const router = new VueRouter({
            mode: "abstract",
            routes: [],
        });
        router.push("/play/testUser/testMusicSession");

        axios.get.mockResolvedValueOnce({ data: { items: fakeAlbumTracks } });

        render(SearchResultAlbum, { props: { album: fakeAlbum }, routes: router });

        await fireEvent.click(screen.getByTestId("open-album"));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
        fakeAlbumTracks.forEach(async (albumTrack) => {
            await waitFor(() => {
                expect(screen.getByText(albumTrack.name)).toBeVisible();
            });
        });
        await waitFor(() => {
            expect(screen.getByTestId("album-drawer")).toHaveStyle("max-height: 480px");
        });
    });
});
