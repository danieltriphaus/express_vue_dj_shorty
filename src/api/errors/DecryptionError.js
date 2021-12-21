function DecryptionError(...args) {
    const instance = Reflect.construct(Error, args);
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    return instance;
  }
  DecryptionError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Reflect.setPrototypeOf(DecryptionError, Error);
  
  module.exports = { DecryptionError };
  