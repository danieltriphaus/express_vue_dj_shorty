const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { EntityNotFoundError } = require("../../errors/EntityNotFoundError");


const saveDevice = async (spotifyUserId, deviceId, spotifyRefreshToken) => {
    const dh = datastoreHandler({
        spotifyUserId,
        deviceId,
        spotifyRefreshToken
    });

    try { 
        const device = await dh.getDevice();

        if (!device || device.refreshToken !== spotifyRefreshToken) {
            throw new EntityNotFoundError("device not fount");
        }
    } catch(error) {
        if (error instanceof EntityNotFoundError) {
            await dh.createDevice();
        } else {
            throw error
        }
    }
}

module.exports = { saveDevice };