const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");
const { MissingParamError } = require("../../errors/MissingParamError");

const getMusicSessions = async (spotifyUserId, refreshToken, userAgent) => {
  return await (async () => {
    const dh = datastoreHandler({
      spotifyUserId,
      userAgent,
      spotifyRefreshToken: refreshToken
    });
    
    if (isSpotifyUserIdMissing()) {
      throw new MissingParamError("Missing Param: 'SpotifyUserId'");
    }
    
    const device = await dh.getDevice();

    if (isRefreshTokenInvalid(device)) {
      throw new InvalidTokenError("Invalid Refresh Token");
    }
    
    const musicSessions = await dh.getMusicSessions(spotifyUserId);

    musicSessions.forEach((musicSession) => {
      delete musicSession.refreshToken;
    });

    return musicSessions;
  })();

  function isSpotifyUserIdMissing() {
    return Boolean(!spotifyUserId || spotifyUserId === "");
  }

  function isRefreshTokenInvalid(device) {
    return refreshToken !== device.refreshToken;
  }
};

module.exports = { getMusicSessions };
