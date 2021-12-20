import { searchSpotify } from "@/frontend/features/Tracks/searchSpotify";
import axios from "axios";

jest.mock("axios");

describe("frontend searchSpotify tests", () => {
    it("should make request and return results with query", async () => {
        axios.get.mockResolvedValueOnce({});

        const sh = searchSpotify({userId: "testUser", musicSessionId: "testMusicSession" }, 5);
        await sh.searchSpotify("test_query", 2, "album");

        expect(axios.get).toHaveBeenCalledWith("/api/user/testUser/music_session/testMusicSession/guest/search", 
            expect.objectContaining({
                params: expect.objectContaining({
                    q: "test_query",
                    limit: 5,
                    offset: 2,
                    type: "album"
                }),
            },
            )
        );
    });

    it("should append tracks to given result", async () => {
        const fakeTracks = {
            items: ["track1", "track2"]
        }
        const fakeSearchResult = {
            tracks: {
                items: ["extra_track_1", "extra_track_2"]
            }
        };
        axios.get.mockResolvedValueOnce({
             data: {
                  ...fakeSearchResult 
            }
        });

        const sh = searchSpotify({userId: "testUser", musicSessionId: "testMusicSession" }, 5);
        const additionalResults = await sh.searchSpotify("test_query", 5);
        const allTracks = sh.appendMoreTracks(fakeTracks, additionalResults);

        expect(allTracks.items).toStrictEqual(fakeTracks.items.concat(fakeSearchResult.tracks.items));
        expect(allTracks.total).toBe(allTracks.items.length);
    });
});