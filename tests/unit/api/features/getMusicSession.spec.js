import { deviceDatastoreHandler } from "@/api/datastore/deviceDatastoreHandler";
import { musicSessionDatastoreHandler } from "@/api/datastore/musicSessionDatastoreHandler";
import { getMusicSession } from "@/api/features/musicSession/getMusicSession";
import { EntityNotFoundError } from "../../../../src/api/errors/EntityNotFoundError";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";

jest.mock("@/api/datastore/datastoreHandler");
jest.mock("@/api/datastore/deviceDatastoreHandler");
jest.mock("@/api/datastore/musicSessionDatastoreHandler");
jest.mock("@google-cloud/datastore");

describe("Tests for GetMusicSession Feature Controller", () => {
    const fakeMusicSessionResult = {
        waitTime: 3,
        spotifyUserId: "testUserId",
        refreshToken: "test_refresh_token",
        encryptionKey: "encKey",
        spotifyPlaylistId: "playlist2",
    };

    function mockReturnFakeMusicSession() {
        datastoreHandler.mockReturnValueOnce({
            async getMusicSession() {
                return fakeMusicSessionResult;
            },
        });
    }

    function mockReturnNoMusicSession() {
        datastoreHandler.mockReturnValueOnce({
            async getMusicSession() {},
        });
    }

    it("should remove refresh Token and encryption Key from datastore result", async () => {
        mockReturnFakeMusicSession();

        const result = await getMusicSession("spotifyUserId");

        expect(result.encryptionKey).toBeFalsy();
        expect(result.refreshToken).toBeFalsy();
    });

    it("should throw EntityNotFoundError when datastore return is empty", async () => {
        mockReturnNoMusicSession();

        expect(getMusicSession()).rejects.toThrowError(EntityNotFoundError);
    });
});
