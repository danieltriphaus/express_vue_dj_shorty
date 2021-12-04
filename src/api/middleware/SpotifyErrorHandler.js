module.exports = (req, res, next) => {
  res.respondWithFailedSpotifyRequest = (error) => {
    res.statusCode = error.response.status;

    res.json({
      apiResponse:
        "Failed Spotify Request, check logs for full Spotify Request",
      spotifyResponseData: error.response.data
    });
  };
  next();
};
