module.exports = {
  authorization: {
    baseUrl: "https://accounts.spotify.com",
    endpoint: "/authorize",
    grantType: "authorization_code",
    redirectEndpoint: "/authorize",
    tokenEndpoint: "/api/token"
  },
  clientId: process.env.SpotifyClientId || process.env.VUE_APP_SPOTIFY_CLIENTID,
  clientSecret: process.env.SpotifyClientSecret
};
