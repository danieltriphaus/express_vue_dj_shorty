import { AccessTokenRefresher } from "@/api/controllers/AccessTokenRefresher";
import axios from "axios";
import AccessToken from "@/classes/AccessToken";

jest.mock("axios");

describe("Access Token Refresh Tests", () => {
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

  it("should refresh accessToken when spotify returns new acess token", async () => {
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

    axios.mockResolvedValueOnce(testSpotifyResponse);

    const refresher = AccessTokenRefresher(
      "test_refresh_token",
      testSpotifyConfig
    );

    const accessToken = await refresher.getRefreshedAccessToken();

    expect(accessToken).toStrictEqual({
      value: testSpotifyResponse.data.access_token,
      expiresIn: testSpotifyResponse.data.expires_in
    });
  });

  it("should throw error on failed spotify response", async () => {
    const testSpotifyResponse = {
      status: 400,
      data: {}
    };

    axios.mockRejectedValueOnce(testSpotifyResponse);

    const refresher = AccessTokenRefresher(
      "test_refresh_token",
      testSpotifyConfig
    );

    await expect(refresher.getRefreshedAccessToken()).rejects.toBeTruthy();
  });
});
