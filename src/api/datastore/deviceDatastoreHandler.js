const { Transaction } = require("@google-cloud/datastore");

const deviceDatastoreHandler = (datastoreInstance, options) => {
  const {spotifyUserId, deviceId, spotifyRefreshToken} = options || {};

  function getDeviceKey() {
    return datastoreInstance.key([
      "user",
      spotifyUserId,
      "device",
      deviceId
    ]);
  }

  return {
    dataProvider: datastoreInstance,

    async getDevice() {
      const key = getDeviceKey();
      const [device] = await this.dataProvider.get(key);
      return device;
    },

    async createDevice() {
      const deviceKey = getDeviceKey(spotifyUserId, deviceId);
      const userKey = datastoreInstance.key(["user", spotifyUserId]);
      
      await this.dataProvider.upsert([
        { 
          key: userKey,
          data: {
            spotifyUserId,
          },
        },
        {
          key: deviceKey,
          data: {
            refreshToken: spotifyRefreshToken
          }
        }
      ]);
    }
  };
};

module.exports = { deviceDatastoreHandler };



