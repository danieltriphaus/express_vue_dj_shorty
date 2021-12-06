import { authenticateDevice } from "@/api/middleware/authenticateDevice";
import { InvalidTokenError } from "@/api/errors/InvalidTokenError";
import { MissingParamError } from "@/api/errors/MissingParamError";
import { NotAuthorizedError } from "@/api/errors/NotAuthorizedError";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";

jest.mock("@/api/datastore/datastoreHandler");

describe("authenticateSpotifyUser tests", () => {
    it("should throw InvalidTokenError when refresh token is invalid", async () => {
        expect(authenticateDevice("testUser", "testDevice")).rejects.toThrowError(InvalidTokenError);
        expect(authenticateDevice("testUser", "testDevice", "")).rejects.toThrowError(InvalidTokenError);
    });

    it ("should throw MissingParamError when deviceId is invalid", async () => {
        expect(authenticateDevice("testUser", "", "refreshToken")).rejects.toThrowError(MissingParamError);
        expect(authenticateDevice("testUser", undefined, "refreshToken")).rejects.toThrowError(MissingParamError);
    });

    it ("should throw NotAuthorizedError when device refreshToken does not match stored token", async () => {
        const fakeDevice = { refreshToken: "testStoredRefreshToken" };

        datastoreHandler.mockReturnValueOnce({
            getDevice: jest.fn().mockResolvedValueOnce(fakeDevice)
        });

        expect(authenticateDevice("testUser", "testDevice", "wrongRefreshToken")).rejects.toThrowError(NotAuthorizedError);
    });

    it ("should throw NotAuthorizedError when deviceId does not exist", async () => {
        datastoreHandler.mockReturnValueOnce({
            getDevice: jest.fn().mockResolvedValueOnce(undefined)
        });

        expect(authenticateDevice("testUser", "testDevice", "wrongRefreshToken")).rejects.toThrowError(NotAuthorizedError);
    });

    it("should do nothing if stored refreshToken is the same as input", async () => {
        const fakeDevice = { refreshToken: "testStoredRefreshToken" };

        datastoreHandler.mockReturnValueOnce({
            getDevice: jest.fn().mockResolvedValueOnce(fakeDevice)
        });

        await authenticateDevice("testUser", "testDevice", fakeDevice.refreshToken);

        expect(true).toBe(true);
    });
});