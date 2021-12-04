import { authenticateSpotifyUser } from "@/api/middleware/authenticateSpotifyUser";
import { InvalidTokenError } from "@/api/errors/InvalidTokenError";

jest.mock("@google-cloud/datastore");

describe("authenticateSpotifyUser tests", () => {
    it("should throw InvalidTokenError when refresh token is invalid", async () => {
        expect(authenticateSpotifyUser("testUser", "testDevice")).rejects.toThrowError(InvalidTokenError);
        expect(authenticateSpotifyUser("testUser", "testDevice", "")).rejects.toThrowError(InvalidTokenError);
    });
});