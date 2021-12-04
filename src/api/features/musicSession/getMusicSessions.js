const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");
const { MissingParamError } = require("../../errors/MissingParamError");

const getMusicSessions = async (spotifyUserId) => {
  return await (async () => {
    const dh = datastoreHandler();
    
    if (isSpotifyUserIdMissing()) {
      throw new MissingParamError("Missing Param: 'SpotifyUserId'");
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
};

module.exports = { getMusicSessions };
