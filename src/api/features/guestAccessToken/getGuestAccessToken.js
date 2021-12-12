const { AccessTokenRefresher } = require("../../controllers/AccessTokenRefresher");
const spotifyConfig = require("../../../config/spotify.config");
const crypto = require("crypto");
const { Buffer } = require("buffer");

const { ENCODINGS } = require("./encodings");

const getGuestAccessToken = async (spotifyRefreshToken, encryptionKey) => {
    const accesssToken = await getSpotifyAccessToken();
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes128", Buffer.from(encryptionKey, ENCODINGS.encryptionKey), iv);

    let guestAccessToken = cipher.update(
        Buffer.from(accesssToken.value, ENCODINGS.unencrypted),
        ENCODINGS.unencrypted, ENCODINGS.encrypted
    );
    guestAccessToken += cipher.final(ENCODINGS.encrypted);
    
    return {
        value: iv.toString(ENCODINGS.encrypted) + ":" + guestAccessToken,
        expiresIn: accesssToken.expiresIn
    }

    async function getSpotifyAccessToken() {
        const refresher = AccessTokenRefresher(spotifyRefreshToken, spotifyConfig);
        return await refresher.getRefreshedAccessToken();
    }
};

module.exports = { getGuestAccessToken };