const { datastoreHandler } = require("../datastore/datastoreHandler");
const { getNewGuestAccessToken } = require("../features/guestAccessToken/getNewGuestAccessToken");
const { decryptGuestAccessToken } = require("../features/guestAccessToken/decryptGuestAccessToken");
const { AccessTokenRefresher } = require("../controllers/AccessTokenRefresher");
const spotifyConfig = require("../../config/spotify.config");

const ACCESS_TOKEN_COOKIE_OPTIONS = {
    guest: ["Path=/", "Secure", "HttpOnly"],
    host: ["Path=/"],
};

const authenticateGuest = async (req, res) => {
    return await (async () => {
        req.isHost = () => {
            return req.cookies.spotify_refresh_token;
        };

        let spotifyAccessToken, guestSpotifyAccessToken;

        const dh = datastoreHandler();
        const musicSession = await dh.getMusicSession(req.params.spotifyUserId, req.params.musicSessionId);

        if (req.isHost()) {
            spotifyAccessToken = await getHostAccessToken();
        } else {
            guestSpotifyAccessToken = await getGuestAccessToken(musicSession);
            spotifyAccessToken = decryptGuestAccessToken(guestSpotifyAccessToken, musicSession.encryptionKey);
        }

        req.djShorty = { spotifyAccessToken, musicSession };
    })();

    async function getGuestAccessToken(musicSession) {
        if (isAccessTokenCokieInvalid()) {
            const guestAccessToken = await getNewGuestAccessToken(
                musicSession.refreshToken,
                musicSession.encryptionKey
            );

            setCookieHeader(guestAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS.guest);
            req.cookies.spotify_access_token = guestAccessToken.value;
        }

        return req.cookies.spotify_access_token;
    }

    async function getHostAccessToken() {
        if (isAccessTokenCokieInvalid()) {
            const refresher = AccessTokenRefresher(req.cookies.spotify_refresh_token, spotifyConfig);
            const accessToken = await refresher.getRefreshedAccessToken();

            setCookieHeader(accessToken, ACCESS_TOKEN_COOKIE_OPTIONS.host);
            req.cookies.spotify_access_token = accessToken.value;
        }

        return req.cookies.spotify_access_token;
    }

    function isAccessTokenCokieInvalid() {
        return !isAccessTokenCookieValid();
    }

    function isAccessTokenCookieValid() {
        return req.cookies.spotify_access_token && req.cookies.spotify_access_token.length > 0;
    }

    function setCookieHeader(accessToken, options) {
        res.setHeader(
            "Set-Cookie",
            "spotify_access_token=" +
                accessToken.value +
                "; Max-Age=" +
                accessToken.expiresIn +
                "; " +
                options.join("; ") +
                ";"
        );
    }
};

module.exports = { authenticateGuest };
