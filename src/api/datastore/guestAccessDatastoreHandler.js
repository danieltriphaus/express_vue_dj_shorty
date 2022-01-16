const { Datastore } = require("@google-cloud/datastore");

const guestAccessDatastoreHandler = (datastore) => {
    return {
        dataProvider: datastore,

        async getGuestAccess(spotifyAccessToken) {
            const key = this.dataProvider.key(["guest_access", spotifyAccessToken]);

            const [guestAccess] = await this.dataProvider.get(key);
            if (guestAccess) {
                delete guestAccess[Datastore.KEY];
            }
            return guestAccess;
        },

        async upsertGuestAccess(params) {
            const key = this.dataProvider.key(["guest_access", params.spotifyAccessToken]);

            const data = {
                ipAddress: params.spotifyAccessToken,
                musicSessionId: params.musicSessionId,
                trackLastAdded: params.trackLastAdded,
            };

            await this.dataProvider.upsert({
                key,
                data,
            });
        },
    };
};

module.exports = { guestAccessDatastoreHandler };
