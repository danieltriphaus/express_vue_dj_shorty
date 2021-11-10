import Authorize from "@/api/controllers/Authorize";
import axios from "axios";
import AccessToken from "@/classes/AccessToken";

jest.mock("axios");

describe("Tests for Controller that makes authorization at Spotify", () => {
  const testSpotifyConfig = {
    authorization: {
      baseUrl: "https://accounts.spotify.com",
      endpoint: "/authorize",
      grantType: "authorization_code",
      redirectEndpoint: "/authorize",
      tokenEndpoint: "/api/token"
    },
    clientId: "testId",
    clientSecret: "testSecret"
  };

  it("should make request to spotify and set tokens", async () => {
    const testSpotifyResponse = {
      status: 200,
      data: {
        access_token: "NgCXRK...MzYjw",
        token_type: "Bearer",
        scope: "user-read-private user-read-email",
        expires_in: 3600,
        refresh_token: "NgAagA...Um_SHo"
      }
    };

    const authorize = new Authorize({
      code: "123",
      spotifyConfig: testSpotifyConfig
    });

    axios.mockResolvedValueOnce(testSpotifyResponse);

    await authorize.requestSpotifyOauthTokens();

    expect(authorize.accessToken).toStrictEqual(
      new AccessToken({
        value: testSpotifyResponse.data.access_token,
        expiresIn: testSpotifyResponse.data.expires_in
      })
    );

    expect(authorize.refreshToken).toStrictEqual(
      new AccessToken({
        value: testSpotifyResponse.data.refresh_token,
        expiresIn: 10 * 365 * 24 * 60 * 60
      })
    );
  });

  it("should throw error on false spotify response", async () => {
    const testSpotifyResponse = {
      status: 400,
      data: { error: "invalid_grant", error_text: "invalid authorization code" }
    };

    const authorize = new Authorize({
      code: "123",
      spotifyConfig: testSpotifyConfig
    });

    axios.mockResolvedValueOnce(testSpotifyResponse);

    await expect(authorize.requestSpotifyOauthTokens()).rejects.toBeTruthy();
  });
});
