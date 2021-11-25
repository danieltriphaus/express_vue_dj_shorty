function InvalidTokenError(...args) {
  const instance = Reflect.construct(Error, args);
  Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
  return instance;
}
InvalidTokenError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Reflect.setPrototypeOf(InvalidTokenError, Error);

module.exports = { InvalidTokenError };
