const { v4: uuidv4 } = require("uuid");
const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");
const { MissingParamError } = require("../../errors/MissingParamError");

const createNewMusicSession = async (params) => {
  let newMusicSession = {};

  return await (async () => {
    if (isSpotifyPlaylistIdMissing()) {
      throw new MissingParamError("Missing Param: 'spotifyPlaylistId'");
    }

    if (isSpotifyRefreshTokenInvalid()) {
      throw new InvalidTokenError("Invalid Refresh Token");
    }

    params.id = generateMusicSessionId();

    const dh = datastoreHandler();
    newMusicSession = await dh.createNewMusicSession(params);

    deleteRefreshTokenFromResult();
    return {
      musicSession: {
        id: params.id,
        ...newMusicSession
      }
    };
  })();

  function isSpotifyPlaylistIdMissing() {
    return !params.spotifyPlaylistId || !params.hasOwnProperty("spotifyPlaylistId") || params.spotifyPlaylistId.length === 0;
  }

  function isSpotifyRefreshTokenInvalid() {
    return !params.spotifyRefreshToken || params.spotifyRefreshToken.length === 0;
  }

  function generateMusicSessionId() {
    return uuidv4();
  }

  function deleteRefreshTokenFromResult() {
    delete newMusicSession.refreshToken;
  }
};

module.exports = { createNewMusicSession };
