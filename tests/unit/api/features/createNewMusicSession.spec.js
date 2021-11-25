import { createNewMusicSession } from "@/api/features/musicSession/createNewMusicSession";
import { v4 as uuidv4 } from "uuid";
import { InvalidTokenError } from "@/api/errors/InvalidTokenError";

jest.mock("@google-cloud/datastore");
jest.mock("uuid");

describe("create new music session tests", () => {
  it("should return created music session but leave out refresh token", async () => {
    uuidv4.mockReturnValue("test_uuid");

    const musicSessionParams = {
      waitTime: 1,
      spotifyPlaylistId: "test_playlist",
      spotifyUserId: "testUser"
    };

    const refreshToken = "test_refresh_token";

    const response = await createNewMusicSession(
      musicSessionParams,
      refreshToken
    );

    expect(response.musicSession).toMatchObject({
      id: "test_uuid",
      spotifyPlaylistId: musicSessionParams.spotifyPlaylistId,
      waitTime: musicSessionParams.waitTime
    });

    expect(response.musicSession).not.toMatchObject({ refreshToken });
    expect(response.musicSession).not.toMatchObject({
      spotifyUserId: musicSessionParams.spotifyUserId
    });
  });

  it("should return error if refresh_token is invalid", async () => {
    expect(createNewMusicSession({}, false)).rejects.toThrow(InvalidTokenError);
    expect(createNewMusicSession({}, undefined)).rejects.toThrow(
      InvalidTokenError
    );
    expect(createNewMusicSession({}, "")).rejects.toThrow(InvalidTokenError);
  });
});
