import { render, screen } from "@testing-library/vue";
import SearchResultTrack from "@/frontend/components/SearchResultTrack";
import "@testing-library/jest-dom";

describe("SearchResultTrack Component Tests", () => {
    const fakeTrack = {
        name: "test Track",
        artists: [{ name: "Artist 01" }, { name: "Artist 02" }],
        album: { images: [{ url: "#" }, { url: "#" }] },
    };

    it("should render track data", () => {
        render(SearchResultTrack, { props: { track: fakeTrack } });

        expect(screen.getByText(fakeTrack.name)).toBeInTheDocument();
        expect(screen.getByText(fakeTrack.artists[0].name + ", " + fakeTrack.artists[1].name)).toBeInTheDocument();
    });
});
