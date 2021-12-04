const { InvalidTokenError } = require("../errors/InvalidTokenError");
const { NotAuthorizedError } = require("../errors/NotAuthorizedError");
const { MissingParamError } = require("../errors/MissingParamError");
const { datastoreHandler } = require("../datastore/datastoreHandler");


const authenticateSpotifyUser = async (spotifyUserId, deviceId, spotifyRefreshToken) => {
    if (!spotifyRefreshToken || !spotifyRefreshToken.length) {
        throw new InvalidTokenError("Invalid Refresh Token");
    }

    if (!deviceId || !deviceId.length) {
        throw new MissingParamError("Missing Param 'userAgent'");
    }
    
    const dh = datastoreHandler({spotifyUserId, deviceId});
    const device = await dh.getDevice();
    if (!device || device.refreshToken !== spotifyRefreshToken) {
        throw new NotAuthorizedError("Not Authorized to Access User Data");
    }
};

module.exports = { authenticateSpotifyUser };