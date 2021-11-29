const { datastoreHandler } = require("../../datastore/datastoreHandler");


const saveDevice = async (spotifyUserId, userAgent, spotifyRefreshToken) => {
    const dh = datastoreHandler({
        spotifyUserId,
        userAgent,
        spotifyRefreshToken
    });
    
    const device = await dh.getDevice();
    
    if (!device || device.refreshToken !== spotifyRefreshToken) {
        await dh.createDevice();
    }
}

module.exports = { saveDevice };