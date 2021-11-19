import { spotifyAuthorizeController } from "@/frontend/features/SpotifyAuthorize/spotifyAuthorizeController";
import VueCookie from "vue-cookie";
import axios from "axios";
import { saveSpotifyUser } from "@/frontend/features/SpotifyAuthorize/saveSpotifyUser";

jest.mock("axios");
jest.mock("@/frontend/features/SpotifyAuthorize/saveSpotifyUser");

describe("Feature spotify authorize tests", () => {
  it("should redirect to spotify login on call without parameters", () => {
    let testUrl = "";
    delete window.location;
    window.location = {
      assign: jest.fn((url) => {
        testUrl = url;
      })
    };

    spotifyAuthorizeController("test_app_url");

    expect(testUrl).toBe(
      "https://accounts.spotify.com/authorize?client_id=5d32c6be193a454aa17e5b420ed8501e&response_type=code&redirect_uri=test_app_url%2Fauthorize&scope=playlist-modify-public"
    );
  });

  it("should set access_token cookie when authCode is given and api request returns access_token", async () => {
    const testApiResponse = {
      data: {
        value: "test_access_token",
        expiresIn: 3600
      }
    };

    let vc = VueCookie;

    axios.create.mockReturnValueOnce({
      post: jest.fn().mockResolvedValueOnce(testApiResponse)
    });

    await spotifyAuthorizeController(
      "test_base_url",
      "test_auth_code",
      "test_api_url",
      vc,
      { push: jest.fn() }
    );

    expect(document.cookie).toContain(
      "spotify_access_token=" + testApiResponse.data.value
    );
  });
});
