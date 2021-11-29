const { Datastore } = require("@google-cloud/datastore");
const { deviceDatastoreHandler } = require("./deviceDatastoreHandler");
const {
  musicSessionDatastoreHandler
} = require("./musicSessionDatastoreHandler");

const datastoreHandler = (options) => {
  
  const datastore = new Datastore();
  let transaction = undefined;
  
  const subHandlers = [
    deviceDatastoreHandler(datastore, options),
    musicSessionDatastoreHandler(datastore, options)
  ];

  function setDataProviderForSubHandlers(dataProvider) {
    subHandlers.forEach((subHandler) => {
      subHandler.dataProvider = dataProvider;
    });
  }

  const datastoreHandler = {
    async startTransaction() {
      transaction = datastore.transaction();
      await transaction.run();
      setDataProviderForSubHandlers(transaction);
      return this;
    },

    async rollbackTransaction() {
      await transaction.rollback();
      setDataProviderForSubHandlers(datastore);
      return this;
    },

    async commitTransaction() {
      await transaction.commit();
      setDataProviderForSubHandlers(datastore);
      return this;
    }
  };

  const callMethodOfSubhandler = {
    get(calledObject, accessedProperty) {
      if (!calledObject[accessedProperty]) {
        const [subHandlerWithMethod] = subHandlers.filter((subHandler) => {
          return (
            subHandler.hasOwnProperty(accessedProperty) &&
            typeof subHandler[accessedProperty] === "function"
          );
        });

        if (subHandlerWithMethod) {
          return function () {
            return subHandlerWithMethod[accessedProperty](...arguments);
          };
        }
      }
      return calledObject[accessedProperty];
    }
  };

  return new Proxy(datastoreHandler, callMethodOfSubhandler);
};

module.exports = { datastoreHandler };
