var { Datastore } = require("@google-cloud/datastore");
const { v4: uuidv4 } = require("uuid");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");

const createNewMusicSession = async (musicSessionParams, refreshToken) => {
  if (refreshToken && refreshToken.length > 0) {
    const datastore = new Datastore();

    const musicSessionid = uuidv4();

    const musicSessionKey = datastore.key([
      "user",
      musicSessionParams.spotifyUserId,
      "music_session",
      musicSessionid
    ]);

    const musicSession = {
      waitTime: musicSessionParams.waitTime,
      spotifyPlaylistId: musicSessionParams.spotifyPlaylistId,
      createdAt: new Date(),
      refreshToken: refreshToken,
      status: "active"
    };

    await datastore.insert({
      key: musicSessionKey,
      data: musicSession
    });

    delete musicSession.refreshToken;

    return {
      musicSession: {
        id: musicSessionid,
        ...musicSession
      }
    };
  } else {
    throw new InvalidTokenError("Invalid Refresh Token");
  }
};

module.exports = { createNewMusicSession };
