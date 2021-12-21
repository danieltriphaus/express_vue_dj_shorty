import { deviceDatastoreHandler } from "@/api/datastore/deviceDatastoreHandler";
import { musicSessionDatastoreHandler } from "@/api/datastore/musicSessionDatastoreHandler";
import { getMusicSessions } from "@/api/features/musicSession/getMusicSessions";
import { MissingParamError } from "@/api/errors/MissingParamError";

jest.mock("@/api/datastore/deviceDatastoreHandler");
jest.mock("@/api/datastore/musicSessionDatastoreHandler");
jest.mock("@google-cloud/datastore");

describe("Tests for GetMusicSession Feature Controller", () => {
  const fakeMusicSessionResult = [
    {
      waitTime: 5,
      spotifyUserId: "testUserId",
      refreshToken: "test_refresh_token",
      encryptionKey: "encKey",
      spotifyPlaylistId: "playlist"
    },
    {
      waitTime: 3,
      spotifyUserId: "testUserId",
      refreshToken: "test_refresh_token",
      encryptionKey: "encKey",
      spotifyPlaylistId: "playlist2"
    }
  ];

  function mockSubHandlers() {
    deviceDatastoreHandler.mockReturnValueOnce({});
    musicSessionDatastoreHandler.mockReturnValueOnce({
      dataProvider: {},
      async getMusicSessions() {
        return fakeMusicSessionResult;
      }
    });
  }

  it("should remove refresh Token and encryptionKey from datastore result", async () => {
    mockSubHandlers();

    const result = await getMusicSessions(
      "spotifyUserId",
    );
    
    expect(result[0].refreshToken).toBeFalsy();
    expect(result[1].refreshToken).toBeFalsy();
    expect(result[0].encryptionKey).toBeFalsy();
    expect(result[1].encryptionKey).toBeFalsy();
  });

  it("should throw MissingParamError if spotifyUserId is missing", async () => {
    mockSubHandlers();

    expect(getMusicSessions()).rejects.toThrowError(MissingParamError);
  });
});
