const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { EntityNotFoundError } = require("../../errors/EntityNotFoundError");

const getMusicSession = async (spotifyUserId, musicSessionId) => {
    const dh = datastoreHandler();
    const musicSession = await dh.getMusicSession(spotifyUserId, musicSessionId);

    if (!musicSession) {
        throw new EntityNotFoundError("musicSession not found");
    }

    delete musicSession.refreshToken;
    delete musicSession.encryptionKey;

    return musicSession;
};

module.exports = { getMusicSession };
