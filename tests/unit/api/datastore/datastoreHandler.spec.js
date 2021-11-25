import { datastoreHandler } from "@/api/datastore/datastoreHandler";
import { deviceDatastoreHandler } from "@/api/datastore/deviceDatastoreHandler";
import { Datastore } from "@google-cloud/datastore";

jest.mock("@google-cloud/datastore");
jest.mock("@/api/datastore/deviceDatastoreHandler");

describe("datastoreHandler tests", () => {
  const deviceHandlerFake = {
    testProperty: "testProperty",
    testFunction: jest.fn((param) => param)
  };

  const fakeTransaction = {
    run: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn()
  };

  function mockDeviceHandler() {
    deviceDatastoreHandler.mockImplementationOnce(() => {
      return deviceHandlerFake;
    });
  }

  function mockDatastoreTransactionForInstance(instanceIndex) {
    Datastore.mock.instances[instanceIndex].transaction = jest.fn(() => {
      return fakeTransaction;
    });
  }

  describe("tests for datastoreHandler Proxy", () => {
    it("should call method of subhandlers if it does not exist on main object", async () => {
      mockDeviceHandler();

      const dh = datastoreHandler();
      dh.testFunction("testParam");

      expect(deviceHandlerFake.testFunction).toHaveBeenCalledWith("testParam");
    });

    it("should not give access to property only in subhandler", () => {
      mockDeviceHandler();

      const dh = datastoreHandler();

      expect(dh.testProperty).toBe(undefined);
    });

    it("should still work as expected for properties and methods not defined on subHandlers or main object", () => {
      mockDeviceHandler();

      const dh = datastoreHandler();

      expect(() => {
        dh.doesNotExist();
      }).toThrowError();

      expect(dh.doesNotExist).toBe(undefined);
    });
  });

  describe("tests for datastore handling", () => {
    it("should set dataProvider on subHandlers to transaction after transaction was started", async () => {
      mockDeviceHandler();

      const dh = datastoreHandler();

      mockDatastoreTransactionForInstance(Datastore.mock.instances.length - 1);

      await dh.startTransaction();

      expect(deviceHandlerFake.dataProvider).toStrictEqual(fakeTransaction);
    });

    it("should set dataProvider on subHandlers to Datastore after transaction was commited", async () => {
      mockDeviceHandler();

      const dh = datastoreHandler();

      mockDatastoreTransactionForInstance(Datastore.mock.instances.length - 1);

      await dh.startTransaction();
      await dh.commitTransaction();

      expect(deviceHandlerFake.dataProvider).toBeInstanceOf(Datastore);
    });

    it("should set dataProvider on subHandlers to Datastore after transaction was rolled back", async () => {
      mockDeviceHandler();

      const dh = datastoreHandler();

      mockDatastoreTransactionForInstance(Datastore.mock.instances.length - 1);

      await dh.startTransaction();
      await dh.rollbackTransaction();

      expect(deviceHandlerFake.dataProvider).toBeInstanceOf(Datastore);
    });
  });
});
