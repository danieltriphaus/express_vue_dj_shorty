function ExternalRequestError(...args) {
    const response = args.splice(1)[0];
    const instance = new Error(...args);
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    instance.response = response;
    return instance;
}
ExternalRequestError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
Reflect.setPrototypeOf(ExternalRequestError, Error);

module.exports = { ExternalRequestError };
  