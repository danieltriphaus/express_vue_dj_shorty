function ExternalRequestError(response, ...args) {
    const instance = new Error(...args);
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    instance.response = response;
    instance.responseData = response.data;
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
  