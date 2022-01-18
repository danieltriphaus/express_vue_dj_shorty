import { AccessTokenRefresher } from "@/api/controllers/AccessTokenRefresher";
import { getNewGuestAccessToken } from "@/api/features/guestAccessToken/getNewGuestAccessToken";
import { decryptGuestAccessToken } from "@/api/features/guestAccessToken/decryptGuestAccessToken";
import crypto from "crypto";
import { DecryptionError } from "../../../../src/api/errors/DecryptionError";

jest.mock("@/api/controllers/AccessTokenRefresher");

describe("guestAccessToken tests", () => {
    const unencryptedAccessToken = { value: "test_access_token", expiresIn: 3600 };

    function mockAccessTokenRefresher() {
        AccessTokenRefresher.mockReturnValueOnce({
            getRefreshedAccessToken() {
                return Promise.resolve(unencryptedAccessToken);
            },
        });
    }

    function generateEncryptionKey() {
        return crypto.generateKeySync("aes", { length: 128 }).export().toString("base64");
    }

    it("should return encryptedAccessToken", async () => {
        mockAccessTokenRefresher();

        const token = await getNewGuestAccessToken("test_refresh_token", generateEncryptionKey());

        expect(token).toBeTruthy();
        expect(token.value).not.toBe(unencryptedAccessToken.value);
        expect(token.expiresIn).toBe(unencryptedAccessToken.expiresIn);
        expect(token.value.length).toBeGreaterThan(unencryptedAccessToken.value.length);
    });

    it("should correctly decrypt guestAccessToken", async () => {
        mockAccessTokenRefresher();

        const encryptionKey = generateEncryptionKey();
        const encryptedToken = await getNewGuestAccessToken("test_refresh_token", encryptionKey);
        const decryptedToken = decryptGuestAccessToken(encryptedToken.value, encryptionKey);

        expect(decryptedToken).toBe(unencryptedAccessToken.value);
    });

    it("should throw error when encryption fails", async () => {
        mockAccessTokenRefresher();

        const encryptionKey = generateEncryptionKey();
        const encryptedToken = await getNewGuestAccessToken("test_refresh_token", encryptionKey);

        expect(() => {
            decryptGuestAccessToken(encryptedToken.value, "wrongKey");
        }).toThrowError(DecryptionError);
        expect(() => {
            decryptGuestAccessToken(encryptedToken.value, generateEncryptionKey());
        }).toThrowError(DecryptionError);
    });
});
