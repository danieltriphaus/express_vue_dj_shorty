import ApiMiddlewareObject from "@/api/routes/authorize";
import request from "supertest";
import axios from "axios";
import cookieParser from "cookie-parser";

jest.mock("axios");

describe("api for spotify authorization and authentication", () => {
  it("should set access_tokens from spotify as cookie when provided authorization_code", async () => {
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

    axios.mockResolvedValue(testSpotifyResponse);
    const app = ApiMiddlewareObject;
    app.use(cookieParser());
    await request(app)
      .post("/")
      .send({ code: "123" })
      .set("Content-Type", "application/json")
      .expect(200)
      .expect((res) => {
        expect(res.header["set-cookie"]).toContain(
          "spotify_access_token=" +
            testSpotifyResponse.data.access_token +
            "; max-age=" +
            testSpotifyResponse.data.expires_in +
            "; Path=/"
        );
        expect(res.header["set-cookie"]).toContain(
          "spotify_refresh_token=" +
            testSpotifyResponse.data.refresh_token +
            "; max-age=" +
            10 * 365 * 24 * 60 * 60 +
            "; Path=/" +
            "; Secure; HttpOnly"
        );
      });
  });
});
