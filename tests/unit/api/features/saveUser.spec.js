import { saveUser } from "@/api/features/saveUser/saveUser";

describe("saveUser tests", () => {
  it("should return true if device exists and refresh token is the same", () => {
    const su = saveUser({ refreshToken: "test_refresh_token" });
    expect(su.doesDeviceExist("test_refresh_token")).toBe(true);
  });

  it("should return false if device does not exist", () => {
    const su = saveUser();
    expect(su.doesDeviceExist("test_refresh_token")).toBe(false);
  });

  it("should return false if refresh token is not the same", () => {
    const su = saveUser({ refreshToken: "test_refresh_token" });
    expect(su.doesDeviceExist("different_refresh_token")).toBe(false);
  });
});
