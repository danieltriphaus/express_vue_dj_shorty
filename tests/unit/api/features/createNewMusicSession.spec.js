import { createNewMusicSession } from "@/api/features/musicSession/createNewMusicSession";
import { nanoid } from "nanoid";
import { InvalidTokenError } from "@/api/errors/InvalidTokenError";
import { MissingParamError } from "@/api/errors/MissingParamError";

jest.mock("@google-cloud/datastore");
jest.mock("nanoid");

describe("create new music session tests", () => {
  it("should return created music session but leave out refresh token", async () => {
    nanoid.mockReturnValue("test_id");

    const musicSessionParams = {
      waitTime: 1,
      spotifyPlaylistId: "test_playlist",
      spotifyUserId: "testUser"
    };

    const spotifyRefreshToken = "test_refresh_token";

    const response = await createNewMusicSession({
      ...musicSessionParams,
      spotifyRefreshToken
    });

    expect(response.musicSession).toMatchObject({
      id: "test_id",
      spotifyPlaylistId: musicSessionParams.spotifyPlaylistId,
      waitTime: musicSessionParams.waitTime
    });

    expect(response.musicSession).not.toMatchObject({ refreshToken: spotifyRefreshToken });
    expect(response.musicSession).not.toMatchObject({
      spotifyUserId: musicSessionParams.spotifyUserId
    });
  });

  it("should return error if refresh_token is invalid", async () => {
    expect(createNewMusicSession({spotifyPlaylistId: "test", spotifyRefreshToken: false})).rejects.toThrow(InvalidTokenError);
    expect(createNewMusicSession({spotifyPlaylistId: "test", spotifyRefreshToken: undefined})).rejects.toThrow(InvalidTokenError);
  });

  it("should return error if spotifyPlaylistId is missing invalid", async () => {
    expect(createNewMusicSession({spotifyPlaylistId: false})).rejects.toThrow(MissingParamError);
    expect(createNewMusicSession({spotifyPlaylistId: ""})).rejects.toThrow(MissingParamError);
    expect(createNewMusicSession({spotifyPlaylistId: undefined})).rejects.toThrow(MissingParamError);
    expect(createNewMusicSession({})).rejects.toThrow(MissingParamError);
  });
});
