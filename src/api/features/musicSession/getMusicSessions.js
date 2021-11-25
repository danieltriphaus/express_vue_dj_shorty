const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");
const { MissingParamError } = require("../../errors/MissingParamError");

const getMusicSessions = async (spotifyUserid, refreshToken, userAgent) => {
  return await (async () => {
    const dh = datastoreHandler();

    if (isSpotifyUserIdMissing()) {
      throw new MissingParamError("Missing Param: 'SpotifyUserId'");
    }

    const device = await dh.getDevice(spotifyUserid, userAgent);

    if (isRefreshTokenInvalid(device)) {
      throw new InvalidTokenError("Invalid Refresh Token");
    }

    const musicSessions = await dh.getMusicSessions(spotifyUserid);

    musicSessions.forEach((musicSession) => {
      delete musicSession.refreshToken;
    });

    return musicSessions;
  })();

  function isSpotifyUserIdMissing() {
    return Boolean(!spotifyUserid || spotifyUserid === "");
  }

  function isRefreshTokenInvalid(device) {
    return refreshToken !== device.refreshToken;
  }
};

module.exports = { getMusicSessions };
