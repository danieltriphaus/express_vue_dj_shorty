function ChangeReadOnlyError(...args) {
  const instance = Reflect.construct(Error, args);
  Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
  return instance;
}
ChangeReadOnlyError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Reflect.setPrototypeOf(ChangeReadOnlyError, Error);

module.exports = { ChangeReadOnlyError };
