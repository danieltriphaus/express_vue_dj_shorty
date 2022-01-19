const { nanoid } = require("nanoid");
const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { InvalidTokenError } = require("../../errors/InvalidTokenError");
const { MissingParamError } = require("../../errors/MissingParamError");
const crypto = require("crypto");

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
        params.encryptionKey = generateEncryptionKey();

        const dh = datastoreHandler();
        newMusicSession = await dh.createNewMusicSession(params);

        return {
            musicSession: {
                id: params.id,
                ...getPublicMusicSession(newMusicSession),
            },
        };
    })();

    function isSpotifyPlaylistIdMissing() {
        return (
            !params.spotifyPlaylistId ||
            !Object.prototype.hasOwnProperty.call(params, "spotifyPlaylistId") ||
            params.spotifyPlaylistId.length === 0
        );
    }

    function isSpotifyRefreshTokenInvalid() {
        return !params.spotifyRefreshToken || params.spotifyRefreshToken.length === 0;
    }

    function generateMusicSessionId() {
        return nanoid(21);
    }

    function generateEncryptionKey() {
        return crypto.generateKeySync("aes", { length: 128 }).export().toString("base64");
    }

    function getPublicMusicSession(musicSession) {
        // eslint-disable-next-line no-unused-vars
        const { encryptionKey, refreshToken, ...result } = musicSession;
        return result;
    }
};

module.exports = { createNewMusicSession };
