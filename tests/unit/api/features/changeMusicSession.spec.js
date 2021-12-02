import { changeMusicSession } from "@/api/features/musicSession/changeMusicSession";
import { MissingParamError } from "@/api/errors/MissingParamError";
import { datastoreHandler } from "@/api/datastore/datastoreHandler";
import { ChangeReadOnlyError } from "@/api/errors/ChangeReadOnlyError";

jest.mock("@/api/datastore/datastoreHandler");

describe("Change Music Session tests", () => {
    const fakeMusicSession = {
        id: "testId",
        createdAt: new Date("1995-12-17T03:24:00").getTime() / 1000,
        spotifyPlaylistId: "testPlaylist",
        refreshToken: "testRefreshToken",
        status: "active",
    };

    function mockDatastoreHandlerFunctions() {
        datastoreHandler.mockReturnValueOnce({
            getMusicSession: jest.fn(() => {return fakeMusicSession}),
            updateMusicSession: jest.fn()
        });
    }

    it("should throw MissingParamError when no data for change is passed", async () => {
        expect(changeMusicSession("testUser", "musicSessionId", {})).rejects.toThrow(MissingParamError);
        expect(changeMusicSession("testUser", "musicSessionId")).rejects.toThrow(MissingParamError);
    });

    it("should merge data for change with existing data and remove refreshToken from result", async() => {
        mockDatastoreHandlerFunctions();

        const changeData = {
            spotifyPlaylistId: "newPlaylist",
            status: "inactive",
        };

        const newMusicSession = await changeMusicSession("testUser", fakeMusicSession.id, changeData)

        expect(newMusicSession).toMatchObject({
            id: fakeMusicSession.id,
            createdAt: fakeMusicSession.createdAt,
            spotifyPlaylistId: changeData.spotifyPlaylistId,
            status: changeData.status
        });
    });

    it("should not be able to change read only fields", async () => {
        const changeDataTests = [
            { id: "newId" },
            { createdAt: new Date("1995-12-17T03:24:00").getTime() },
            { refreshToken: "newRefreshToken"}
        ];

        mockDatastoreHandlerFunctions();
        expect(changeMusicSession("testUser", fakeMusicSession.id, changeDataTests[0])).rejects.toThrowError(ChangeReadOnlyError)
        
        mockDatastoreHandlerFunctions();
        expect(changeMusicSession("testUser", fakeMusicSession.id, changeDataTests[1])).rejects.toThrowError(ChangeReadOnlyError)

        mockDatastoreHandlerFunctions();
        expect(changeMusicSession("testUser", fakeMusicSession.id, changeDataTests[2])).rejects.toThrowError(ChangeReadOnlyError)
    });

    it("should not convert createdAt", async () => {
        mockDatastoreHandlerFunctions();

        const updatedMusicSession = await changeMusicSession("testUser", fakeMusicSession.id, {status: "active"});

        expect(updatedMusicSession.createdAt).toEqual(fakeMusicSession.createdAt);
    });
});