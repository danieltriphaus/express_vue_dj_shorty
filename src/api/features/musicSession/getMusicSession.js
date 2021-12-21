const { datastoreHandler } = require("../../datastore/datastoreHandler");

const getMusicSession = async (spotifyUserId, musicSessionId) => {
    const dh = datastoreHandler();
    const musicSession = await dh.getMusicSession(spotifyUserId, musicSessionId);

    delete musicSession.refreshToken;
    delete musicSession.encryptionKey;
    
    return musicSession;
};

module.exports = { getMusicSession }