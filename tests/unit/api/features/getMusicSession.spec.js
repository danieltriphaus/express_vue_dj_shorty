import { deviceDatastoreHandler } from "@/api/datastore/deviceDatastoreHandler";
import { musicSessionDatastoreHandler } from "@/api/datastore/musicSessionDatastoreHandler";
import { getMusicSession } from "@/api/features/musicSession/getMusicSession";

jest.mock("@/api/datastore/deviceDatastoreHandler");
jest.mock("@/api/datastore/musicSessionDatastoreHandler");
jest.mock("@google-cloud/datastore");

describe("Tests for GetMusicSession Feature Controller", () => {
  const fakeMusicSessionResult = {
      waitTime: 3,
      spotifyUserId: "testUserId",
      refreshToken: "test_refresh_token",
      encryptionKey: "encKey",
      spotifyPlaylistId: "playlist2"
    }

  function mockSubHandlers() {
    deviceDatastoreHandler.mockReturnValueOnce({});
    musicSessionDatastoreHandler.mockReturnValueOnce({
      dataProvider: {},
      async getMusicSession() {
        return fakeMusicSessionResult;
      }
    });
  }

  it("should remove refresh Token and encryption Key from datastore result", async () => {
      mockSubHandlers();

      const result = await getMusicSession(
        "spotifyUserId",
      );
      
      expect(result.encryptionKey).toBeFalsy();
      expect(result.refreshToken).toBeFalsy();
  });
});
