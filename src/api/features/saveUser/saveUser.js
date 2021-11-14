module.exports.saveUser = (device) => {
  return {
    doesDeviceExist(refreshToken) {
      return Boolean(device && device.refreshToken === refreshToken);
    }
  };
};
