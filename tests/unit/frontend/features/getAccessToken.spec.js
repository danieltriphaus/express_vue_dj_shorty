import { getAccessTokenController } from "@/frontend/features/GetAccessToken/getAccessToken";
import VueCookie from "vue-cookie";
import axios from "axios";

jest.mock("axios");

describe("test for access token refresh", () => {
    beforeEach(mockConsoleErrorOnce);
    afterEach(deleteAccessTokenCookie);

    it("should set access token cookie if cookie is invalid", async () => {
        const testApiResponse = {
            data: {
                value: "test_access_token",
                expiresIn: 3600,
            },
        };
        let vc = VueCookie;
        axios.create.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce(testApiResponse),
        });

        await getAccessTokenController(vc);

        expect(vc.get("spotify_access_token")).toBe(testApiResponse.data.value);
    });

    it("should return access token and set cookie if cookie is invalid and api response is valid", async () => {
        const testApiResponse = {
            data: {
                value: "test_access_token",
                expiresIn: 3600,
            },
        };
        let vc = VueCookie;
        axios.create.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce(testApiResponse),
        });

        const accessToken = await getAccessTokenController(vc);

        expect(accessToken).toBe(testApiResponse.data.value);
        expect(document.cookie).toContain("spotify_access_token=" + testApiResponse.data.value);
    });

    it("should return undefined if api response is invalid", async () => {
        const testApiResponse = {};

        let vc = VueCookie;
        axios.create.mockReturnValueOnce({
            get: jest.fn().mockRejectedValueOnce(testApiResponse),
        });

        expect(getAccessTokenController("https://test_api_url", vc)).rejects.toThrowError();
    });

    it("should return access_token if cookie is set", async () => {
        let vc = VueCookie;
        vc.set("spotify_access_token", "test_access_token");
        const accessToken = await getAccessTokenController(vc);

        expect(accessToken).toBe("test_access_token");
    });
});

function deleteAccessTokenCookie() {
    VueCookie.delete("spotify_access_token");
}

function mockConsoleErrorOnce() {
    jest.spyOn(console, "error");
    console.error.mockImplementationOnce(() => null);
}
