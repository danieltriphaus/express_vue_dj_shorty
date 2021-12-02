import { musicSessionResultFormatter } from "@/api/datastore/musicSessionResultFormatter";
import { Datastore } from "@google-cloud/datastore";
import { datastoreHandler } from "../../../../src/api/datastore/datastoreHandler";

describe("musicSessionResultFormatter tests", () => {
    const fakeQueryByUserResult = [
        {
          status: 'active',
          spotifyPlaylistId: 'testPlaylist1',
          createdAt: 1638376794247000,
          waitTime: '3',
          [Datastore.KEY]: { name: "testMusicSessionId1" }
        },
        {
          status: 'active',
          createdAt: 1638376813183000,
          spotifyPlaylistId: 'testPlaylist2',
          waitTime: '4',
          [Datastore.KEY]: { name: "testMusicSessionId2" }
        }
      ];

      function getDatastoreKeyAsValue(datastoreEntity) {
          return datastoreEntity[Datastore.KEY];
      }

      it("should remove Datastore Symbol from array result and add id", () => {
        const formattedResult = musicSessionResultFormatter(fakeQueryByUserResult).getUniversalEntityArray();
        

        expect(formattedResult).toEqual(
            expect.arrayContaining([
                expect.not.objectContaining({[Datastore.KEY]: getDatastoreKeyAsValue(fakeQueryByUserResult[0])}),
                expect.not.objectContaining({[Datastore.KEY]: getDatastoreKeyAsValue(fakeQueryByUserResult[1])}),
            ])
        );

        expect(formattedResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({id: getDatastoreKeyAsValue(fakeQueryByUserResult[0]).name}),
                expect.objectContaining({id: getDatastoreKeyAsValue(fakeQueryByUserResult[1]).name}),
            ])
        )
      });

      it("should convert createdAt of array result to unix timestamp", () => {
          const formattedResult = musicSessionResultFormatter(fakeQueryByUserResult).getUniversalEntityArray();

          expect(formattedResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({createdAt: fakeQueryByUserResult[0].createdAt / 1000}),
                expect.objectContaining({createdAt: fakeQueryByUserResult[1].createdAt / 1000}),
            ])
        ) 
      });

      it("should remove Datastore Symbol from single entity result", () => {
        const formattedResult = musicSessionResultFormatter(fakeQueryByUserResult[0]).getUniversalEntity();
        
        expect(formattedResult.id).toEqual(getDatastoreKeyAsValue(fakeQueryByUserResult[0]).name);
        expect(formattedResult[Datastore.KEY]).toBeFalsy();
      });

      it("should convert createdAt of single entity result to unix timestamp", () => {
        const fakeEntityResult = Object.assign(fakeQueryByUserResult[0]);
        fakeEntityResult.createdAt = new Date(fakeEntityResult.createdAt / 1000).toISOString();
        
        const formattedResult = musicSessionResultFormatter(fakeEntityResult).getUniversalEntity();
        expect(formattedResult.createdAt).toEqual(new Date(fakeEntityResult.createdAt).getTime() / 1000);
      });

      it("should convert different date formats to unix timestamp", () => {
        const testEntityArray = Object.assign(fakeQueryByUserResult);
        testEntityArray[0].createdAt = 1638450417 * 1000;
        testEntityArray[1].createdAt = "2021-12-02T13:06:57.000Z";
        const formattedWithMillSeconds = musicSessionResultFormatter(testEntityArray[0]).getUniversalEntity();
        const formattedWithISOString = musicSessionResultFormatter(testEntityArray[1]).getUniversalEntity();

        expect(formattedWithISOString.createdAt).toEqual(formattedWithMillSeconds.createdAt);
      });
});