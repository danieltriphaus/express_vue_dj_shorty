function EntityNotFoundError(...args) {
    const instance = Reflect.construct(Error, args);
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    return instance;
  }
  EntityNotFoundError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Reflect.setPrototypeOf(EntityNotFoundError, Error);
  
  module.exports = { EntityNotFoundError };
  