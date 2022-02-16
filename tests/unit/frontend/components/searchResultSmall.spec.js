import { render, screen } from "@testing-library/vue";
import SearchResultSmall from "@/frontend/components/SearchResultSmall";
import "@testing-library/jest-dom";

describe("SearchResultTrack Component Tests", () => {
    const fakeTrack = {
        name: "test Track",
        artists: [{ name: "Artist 01" }, { name: "Artist 02" }],
    };

    it("should render track data", () => {
        render(SearchResultSmall, { props: { track: fakeTrack } });

        expect(screen.getByText(fakeTrack.name)).toBeInTheDocument();
        expect(screen.getByText(fakeTrack.artists[0].name + ", " + fakeTrack.artists[1].name)).toBeInTheDocument();
    });
});
