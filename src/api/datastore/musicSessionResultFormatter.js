const { Datastore } = require("@google-cloud/datastore");

const musicSessionResultFormatter = (resultRaw) => {
  return {
    formatGetMusicSessionByUserResult() {
      resultRaw.forEach((entity) => {
        entity.id = entity[Datastore.KEY].name;
      });

      return resultRaw.map((entity) => {
        const formattedResult = { ...entity };
        delete formattedResult[Datastore.KEY];
        formattedResult.createdAt = entity.createdAt / 1000;
        return formattedResult;
      });
    }
  };
};

module.exports = { musicSessionResultFormatter };
