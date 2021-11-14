var { Datastore } = require("@google-cloud/datastore");
const { saveUser } = require("./saveUser");

module.exports.saveUserDatastore = async (
  spotifyUserId,
  userAgent,
  spotifyRefreshToken
) => {
  const datastore = new Datastore();
  const transaction = datastore.transaction();
  await transaction.run();

  async function save(entitites) {
    transaction.upsert(entitites);
    await transaction.commit();
  }

  function getUserKey() {
    return datastore.key(["user", spotifyUserId]);
  }

  return {
    async getDeviceFromDb() {
      const deviceKey = this.getDeviceKey();
      let [device] = await transaction.get(deviceKey);
      return device;
    },
    getDeviceKey() {
      return datastore.key(["user", spotifyUserId, "device", userAgent]);
    },
    async saveEntities() {
      await save([
        {
          key: getUserKey(),
          data: {
            spotifyUserId
          }
        },
        {
          key: this.getDeviceKey(),
          data: {
            refreshToken: spotifyRefreshToken
          }
        }
      ]);
    },

    transactionRollback() {
      transaction.rollback();
    }
  };
};
