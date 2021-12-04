const { datastoreHandler } = require("../../datastore/datastoreHandler");


const saveDevice = async (spotifyUserId, deviceId, spotifyRefreshToken) => {
    const dh = datastoreHandler({
        spotifyUserId,
        deviceId,
        spotifyRefreshToken
    });
    
    const device = await dh.getDevice();
    
    if (!device || device.refreshToken !== spotifyRefreshToken) {
        await dh.createDevice();
    }
}

module.exports = { saveDevice };