import { enforceAddTrackDelay } from "@/api/features/addTrackDelay/enforceAddTrackDelay";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";
import { AddTrackDelayError } from "@/api/errors/AddTrackDelayError";

jest.mock("@google-cloud/datastore");
jest.mock("@/api/datastore/datastoreHandler");

describe("addTrackDelay tests", () => {
    it("should throw error when waitTime is not elapsed", async () => {
        const fakeGuestAccess = {
            trackLastAdded: new Date()
        };

        mockDatastoreHandler(fakeGuestAccess);

        expect(enforceAddTrackDelay("192.168.0.1", "fakeMusicSession", 4).checkGuestAccess()).rejects.toThrowError(AddTrackDelayError);
    });
});

function mockDatastoreHandler(fakeGuestAccess) {
    datastoreHandler.mockReturnValueOnce({
        getGuestAccess() { return fakeGuestAccess; },
        upsertGuestAccess() { },
    });
}
