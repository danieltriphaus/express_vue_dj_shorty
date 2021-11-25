const deviceDatastoreHandler = (datastoreInstance) => {
  return {
    dataProvider: datastoreInstance,

    async getDevice(spotifyUserId, userAgent) {
      const key = datastoreInstance.key([
        "user",
        spotifyUserId,
        "device",
        userAgent
      ]);
      const [device] = await this.dataProvider.get(key);
      return device;
    }
  };
};

module.exports = { deviceDatastoreHandler };
