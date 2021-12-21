const { Buffer } = require("buffer");
const crypto = require("crypto");
const { DecryptionError } = require("../../errors/DecryptionError");
const { ENCODINGS } = require("./encodings");

const decryptGuestAccessToken = (guestAccessToken, encryptionKey) => {
    const decryptIV = Buffer.from(guestAccessToken.split(":")[0], "hex");
    const encryptedAccessToken = guestAccessToken.split(":")[1];
    
    try {
        const decipher = crypto.createDecipheriv("aes128", Buffer.from(encryptionKey, ENCODINGS.encryptionKey), decryptIV);
        let decryptedAccessToken = decipher.update(Buffer.from(encryptedAccessToken, ENCODINGS.encrypted));
        decryptedAccessToken  += decipher.final();

        return decryptedAccessToken.toString(ENCODINGS.unencrypted);
    } catch(error) {
        throw new DecryptionError("decryption failed");
    }
};

module.exports = { decryptGuestAccessToken };