function AddTrackDelayError(...args) {
    const instance = Reflect.construct(Error, args);
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    return instance;
  }
  AddTrackDelayError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Reflect.setPrototypeOf(AddTrackDelayError, Error);
  
  module.exports = { AddTrackDelayError };
  