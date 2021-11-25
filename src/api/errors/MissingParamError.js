function MissingParamError(...args) {
  const instance = Reflect.construct(Error, args);
  Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
  return instance;
}
MissingParamError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Reflect.setPrototypeOf(MissingParamError, Error);

module.exports = { MissingParamError };
