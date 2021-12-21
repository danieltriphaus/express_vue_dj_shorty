import { addTrack } from "@/frontend/features/Tracks/addTrack";
import axios from "axios";
import { AddTrackDelayError } from "../../../../src/frontend/errors/AddTrackDelayError";

jest.mock("axios");

describe("frontend addTrack tests", () => {
    it("should throw AddTrackDelayError if api response is status 429", async () => {
        axios.post.mockRejectedValueOnce({ response: { status: 429 } });

        const testParams = {
            userId: "testUser",
            musicSessionId: "testMusicSession",
        }

        let err;
        try {
            await addTrack(testParams);
        } catch(error) {
            err = error;
        }

        expect(err).toBeInstanceOf(AddTrackDelayError);
    });

    it("should throw error if api response status  is > 400", async () => {
        const testResponse = { response: { status: 401 } }
        axios.post.mockRejectedValueOnce(testResponse);

        const testParams = {
            userId: "testUser",
            musicSessionId: "testMusicSession",
        }

        let err;
        try {
            await addTrack(testParams);
        } catch(error) {
            err = error;
        }

        expect(err).toStrictEqual(testResponse);
    });
});