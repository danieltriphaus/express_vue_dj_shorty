import { saveDevice } from "@/api/features/device/saveDevice";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";

jest.mock("@/api/datastore/datastoreHandler");

describe("saveDevice Feature tests", () => {
    it("should create device if device does not exist", async () => {
        const createDeviceMock = jest.fn();
        
        datastoreHandler.mockReturnValueOnce({
            createDevice: createDeviceMock,
            getDevice: jest.fn(() => { return undefined })
        });

        await saveDevice("testUser", "testUserAgent", "test_refresh_token");

        expect(createDeviceMock).toBeCalled();
    });

    it("should change device if refresh token is different", async () => {
        const createDeviceMock = jest.fn();
        
        datastoreHandler.mockReturnValueOnce({
            createDevice: createDeviceMock,
            getDevice: jest.fn(() => { return { refreshToken: "old_refresh_token" } })
        });

        await saveDevice("testUser", "testUserAgent", "test_refresh_token");

        expect(createDeviceMock).toBeCalled();
    });

    it("should not create device if device exists and refreshToken is the same", async () => {
        const createDeviceMock = jest.fn();
        
        datastoreHandler.mockReturnValueOnce({
            createDevice: createDeviceMock,
            getDevice: jest.fn(() => { return { refreshToken: "test_refresh_token" } })
        });

        await saveDevice("testUser", "testUserAgent", "test_refresh_token");

        expect(createDeviceMock).not.toBeCalled();
    });
});