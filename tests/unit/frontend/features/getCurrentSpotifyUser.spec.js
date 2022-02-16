import { getCurrentSpotifyUser } from "@/frontend/features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import axios from "axios";

jest.mock("axios");

describe("getCurrentSpotifyUser Tests", () => {
    const currentUserResponse = {
        display_name: "testUser",
    };

    it("should return empty view data if no access_token is provided", async () => {
        expect(await getCurrentSpotifyUser()).toStrictEqual({ display_name: "" });
    });

    it("should return successful response for current user", async () => {
        axios.get.mockResolvedValueOnce({ data: currentUserResponse });

        const spotifyUser = await getCurrentSpotifyUser("access_token");

        expect(spotifyUser.display_name).toBe(currentUserResponse.display_name);
    });

    it("should make delete request to /authorize if response is 401", async () => {
        axios.get.mockRejectedValueOnce({ response: { status: 401, data: {} } });
        await getCurrentSpotifyUser("access_token");

        expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("/authorize"), expect.objectContaining({}));
    });

    it("should throw rejected value from api", async () => {
        const errorResponse = { test: true };
        axios.get.mockRejectedValueOnce(errorResponse);

        try {
            await getCurrentSpotifyUser("access_token");
        } catch (error) {
            expect(error).toStrictEqual(errorResponse);
        }
    });
});
