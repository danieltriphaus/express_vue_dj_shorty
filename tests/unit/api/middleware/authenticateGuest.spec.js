import { authenticateGuest } from "@/api/middleware/authenticateGuest";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";
import { decryptGuestAccessToken } from "@/api/features/guestAccessToken/decryptGuestAccessToken";
import { getNewGuestAccessToken } from "@/api/features/guestAccessToken/getNewGuestAccessToken";
import { AccessTokenRefresher } from "@/api/controllers/AccessTokenRefresher";

jest.mock("@/api/datastore/datastoreHandler");
jest.mock("@/api/features/guestAccessToken/decryptGuestAccessToken");
jest.mock("@/api/features/guestAccessToken/getNewGuestAccessToken");
jest.mock("@/api/controllers/AccessTokenRefresher");

describe("authenticateGuest tests", () => {
    const request = {
        params: {
            spotifyUserId: "testUser",
            musicSessionId: "testMusicSession",
        },
        cookies: {
            spotify_access_token: undefined,
            spotify_refresh_token: undefined,
        },
    };

    const fakeMusicSession = {
        refreshToken: "testRefreshToken",
        encryptionKey: "testEncryptionKey",
    };

    function mockDatastoreHandler() {
        datastoreHandler.mockReturnValueOnce({
            async getMusicSession() {
                return fakeMusicSession;
            },
        });
    }

    const response = {
        headers: {},
        setHeader(name, value) {
            this.headers[name] = value;
        },
    };

    it("should set Set-Cookie Header to returned guestAccessToken when no access_token is set in cookie", async () => {
        mockDatastoreHandler();

        request.cookies.spotify_access_token = undefined;

        const testGuestAccessToken = {
            value: "testGuestAccessToken",
            expiresIn: 3600,
        };

        getNewGuestAccessToken.mockReturnValueOnce(testGuestAccessToken);

        await authenticateGuest(request, response);

        expect(response.headers["Set-Cookie"]).toBe(
            "spotify_access_token=" +
                testGuestAccessToken.value +
                "; Max-Age=" +
                testGuestAccessToken.expiresIn +
                "; Path=/; Secure; HttpOnly;"
        );

        expect(request.djShorty.musicSession).toBe(fakeMusicSession);
    });

    it("should set decrypted access token to request object", async () => {
        mockDatastoreHandler();
        const decryptedAccessToken = "decryptedAccessToken";
        decryptGuestAccessToken.mockReturnValueOnce(decryptedAccessToken);

        request.cookies.spotify_access_token = "encryptedAccessToken";

        await authenticateGuest(request, response);

        expect(decryptGuestAccessToken).toBeCalledWith("encryptedAccessToken", fakeMusicSession.encryptionKey);
        expect(request.djShorty.spotifyAccessToken).toBe(decryptedAccessToken);

        expect(request.djShorty.musicSession).toBe(fakeMusicSession);
    });

    it("should set host access token to request if refresh_token is set in cookie", async () => {
        const accessToken = "spotifyAccessToken";
        const refreshToken = "spotifyRefreshToken";

        mockDatastoreHandler();

        request.cookies = {
            spotify_access_token: accessToken,
            spotify_refresh_token: refreshToken,
        };

        await authenticateGuest(request, response);

        expect(request.djShorty.spotifyAccessToken).toBe(accessToken);
        expect(request.cookies.spotify_refresh_token).toBe(refreshToken);

        expect(request.djShorty.musicSession).toBe(fakeMusicSession);
    });

    it("should refresh host access token and set to request if refresh token is set in cookie", async () => {
        const refreshToken = "spotifyRefreshToken";
        const newAccessToken = {
            value: "newAccessToken",
            expiresIn: 3600,
        };

        mockDatastoreHandler();
        AccessTokenRefresher.mockReturnValueOnce({
            getRefreshedAccessToken() {
                return newAccessToken;
            },
        });

        request.cookies = {
            spotify_access_token: undefined,
            spotify_refresh_token: refreshToken,
        };

        await authenticateGuest(request, response);

        expect(request.djShorty.spotifyAccessToken).toBe(newAccessToken.value);
        expect(request.djShorty.musicSession).toBe(fakeMusicSession);

        expect(response.headers["Set-Cookie"]).toBe(
            "spotify_access_token=" + newAccessToken.value + "; Max-Age=" + newAccessToken.expiresIn + "; Path=/;"
        );
    });
});
