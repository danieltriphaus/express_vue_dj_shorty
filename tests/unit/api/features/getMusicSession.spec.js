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
      spotifyPlaylistId: "playlist"
    },
    {
      waitTime: 3,
      spotifyUserId: "testUserId",
      refreshToken: "test_refresh_token",
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

  it("should remove refresh Token from datastore result", async () => {
    mockSubHandlers();

    const result = await getMusicSessions(
      "spotifyUserId",
    );

    expect(result).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          refreshToken: fakeMusicSessionResult[0].refreshToken
        }),
        expect.objectContaining({
          refreshToken: fakeMusicSessionResult[1].refreshToken
        })
      ])
    );
  });

  it("should throw MissingParamError if spotifyUserId is missing", async () => {
    mockSubHandlers();

    expect(getMusicSessions()).rejects.toThrowError(MissingParamError);
  });
});
