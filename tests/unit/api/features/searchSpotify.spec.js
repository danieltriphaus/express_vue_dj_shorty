import { searchSpotify } from "@/api/features/track/searchSpotify";
import axios from "axios";
import { MissingParamError } from "@/api/errors/MissingParamError";
import spotifyConfig from "@/config/spotify.config";
import { stringify } from "uuid";

jest.mock("axios");

describe("searchSpotify tests", () => {
    it("should throw MissingParamError if query is not defined", () => {
        expect(searchSpotify()).rejects.toThrowError(MissingParamError);
    });

    it("should make request and return results with query limit and offset", async () => {
        axios.get.mockResolvedValueOnce({});

        await searchSpotify("query", 5, 1, "test_access_token")

        expect(axios.get).toHaveBeenCalledWith(spotifyConfig.baseUrl + "search", 
            expect.objectContaining({
                params: expect.objectContaining({
                    q: "query",
                    limit: 5,
                    offset: 1,
                    type: expect.stringContaining(""),
                }),
                headers: expect.objectContaining({
                    "Authorization": expect.stringContaining("Bearer")
                })
            },
            )
        );
    });

    it("should make request and return results with query", async () => {
        axios.get.mockResolvedValueOnce({});

        await searchSpotify("query", undefined, undefined, "test_access_token")

        expect(axios.get).toHaveBeenCalledWith(spotifyConfig.baseUrl + "search", 
            expect.objectContaining({
                params: expect.objectContaining({
                    q: "query",
                    type: expect.stringContaining(""),
                }),
                headers: expect.objectContaining({
                    "Authorization": expect.stringContaining("Bearer")
                })
            },
            )
        );
    });
});