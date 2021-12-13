const { Datastore } = require("@google-cloud/datastore");

const guestAccessDatastoreHandler = (datastore) => {
    return {
        dataProvider: datastore,

        async getGuestAccess(ipAddress, musicSessionId) {
            const key = this.dataProvider.key(["guest_access", ipAddress]);

            const [guestAccess] = await this.dataProvider.get(key);
            delete guestAccess[Datastore.KEY];
            return guestAccess;
        },

        async upsertGuestAccess(params) {
            const key = this.dataProvider.key(["guest_access", params.ipAddress]);

            const data = {
                ipAddress: params.ipAddress,
                musicSessionId: params.musicSessionId,
                trackLastAdded: params.trackLastAdded
            };

            await this.dataProvider.upsert({
                key,
                data
            });
        }
    }
};

module.exports = { guestAccessDatastoreHandler };