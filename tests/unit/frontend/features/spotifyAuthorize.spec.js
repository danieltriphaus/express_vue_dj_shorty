import { spotifyAuthorizeController } from "@/frontend/features/SpotifyAuthorize/spotifyAuthorizeController";
import VueCookie from "vue-cookie";
import axios from "axios";
import spotifyConfig from "@/config/spotify.config";

jest.mock("axios");
jest.mock("@/frontend/features/SpotifyAuthorize/saveSpotifyUser");
jest.mock("nanoid");

describe("Feature spotify authorize tests", () => {
    it("should redirect to spotify login on call without parameters", () => {
        let testUrl = "";
        delete window.location;
        window.location = {
            assign: jest.fn((url) => {
                testUrl = url;
            }),
        };

        spotifyAuthorizeController("test_app_url");

        expect(testUrl).toBe(
            "https://accounts.spotify.com/authorize?client_id=" +
                spotifyConfig.clientId +
                "&response_type=code&redirect_uri=test_app_url%2Fauthorize&state=undefined&scope=playlist-modify-public"
        );

        expect(document.cookie).toContain("state=undefined");
    });

    it("should set access_token cookie when authCode is given and api request returns access_token", async () => {
        const testApiResponse = {
            data: {
                value: "test_access_token",
                expiresIn: 3600,
            },
        };

        let vc = VueCookie;
        vc.set("state", "state");

        axios.create.mockReturnValueOnce({
            post: jest.fn().mockResolvedValueOnce(testApiResponse),
        });

        axios.post.mockResolvedValueOnce(testApiResponse);

        await spotifyAuthorizeController("test_base_url", "test_auth_code", "state", "test_api_url", vc, {
            push: jest.fn(),
        });

        expect(document.cookie).toContain("spotify_access_token=" + testApiResponse.data.value);
    });

    it("should redirect to / when state token is incorrect", async () => {
        const testApiResponse = {
            data: {
                value: "test_access_token",
                expiresIn: 3600,
            },
        };

        let vc = VueCookie;
        vc.set("state", "state");

        axios.create.mockReturnValueOnce({
            post: jest.fn().mockResolvedValueOnce(testApiResponse),
        });

        axios.post.mockResolvedValueOnce(testApiResponse);
        let redirect = [];
        await spotifyAuthorizeController("test_base_url", "test_auth_code", "test_api_url", "incorrectState", vc, {
            push: jest.fn((route) => {
                redirect.push(route);
            }),
        });

        expect(redirect).toContain("/");
    });
});
