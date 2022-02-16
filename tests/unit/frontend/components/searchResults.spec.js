import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import SearchResults from "@/frontend/components/SearchResults";
import { faker } from "@faker-js/faker";
import { fireEvent } from "@testing-library/dom";

describe("SearchResults Component Tests", () => {
    const fakeSearchResults = {
        tracks: { items: [] },
        albums: { items: [] },
    };

    function populateSearchResults(amount) {
        for (let i = 0; i < amount; i++) {
            fakeSearchResults.tracks.items.push({
                id: faker.datatype.number(),
                name: faker.lorem.sentence(),
                artists: [{ name: faker.name.findName() }],
                album: {
                    images: [{ url: faker.image.image() }, { url: faker.image.image() }],
                },
            });
            fakeSearchResults.albums.items.push({
                id: faker.datatype.number(),
                name: faker.lorem.sentence(),
                artists: [{ name: faker.name.findName() }],
                images: [{ url: faker.image.image() }, { url: faker.image.image() }],
            });
        }
    }

    afterEach(() => {
        fakeSearchResults.tracks.items = [];
        fakeSearchResults.albums.items = [];
    });

    it("should show 'more items' buttons when results are greater than 5", () => {
        populateSearchResults(6);

        render(SearchResults, { props: { searchResults: fakeSearchResults } });

        expect(screen.getByText("Mehr Songs")).toBeVisible();
        expect(screen.getByText("Mehr Alben")).toBeVisible();
    });

    it("should not show 'more items' buttons when there are not results", () => {
        render(SearchResults, { props: { searchResults: {} } });

        expect(screen.getByText("Mehr Songs")).not.toBeVisible();
        expect(screen.getByText("Mehr Alben")).not.toBeVisible();
    });

    it("should emit load-more-x events with counter", async () => {
        populateSearchResults(5);

        const utils = render(SearchResults, { props: { searchResults: fakeSearchResults } });

        for (let i = 0; i < 2; i++) {
            await fireEvent.click(screen.getByText("Mehr Songs"));

            await waitFor(() => {
                expect(utils.emitted()["load-more-songs"][i][0]).toBe(i + 1);
            });

            await fireEvent.click(screen.getByText("Mehr Alben"));

            await waitFor(() => {
                expect(utils.emitted()["load-more-albums"][i][0]).toBe(i + 1);
            });
        }
    });
});
