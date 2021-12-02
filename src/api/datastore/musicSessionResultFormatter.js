const { Datastore } = require("@google-cloud/datastore");

const musicSessionResultFormatter = (resultRaw) => {
  return {
    getUniversalEntityArray() {
      return resultRaw.map((entity) => getUniversalEntityFromDatastoreEntity(entity));
    },

    getUniversalEntity() {
      return getUniversalEntityFromDatastoreEntity(resultRaw);
    }
  };

  function getUniversalEntityFromDatastoreEntity(entity) {
    const formattedResult = getEntityWithIdAndTimestamp(entity);
    delete formattedResult[Datastore.KEY];
    return formattedResult;
  }

  function getEntityWithIdAndTimestamp(entity) {
    return {
      ...entity,
      id: entity[Datastore.KEY].name,
      createdAt: convertDateIntoTimestamp(entity.createdAt)
    };
  }

  function convertDateIntoTimestamp(date) {
    const result = new Date(date).getTime() / 1000;
    return result;
  }
};

module.exports = { musicSessionResultFormatter };


