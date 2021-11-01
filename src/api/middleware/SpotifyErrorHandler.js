module.exports = (req, res, next) => {
  res.respondWithFailedSpotifyRequest = (error) => {
    console.log(error.response);
    res.statusCode = error.response.status;

    res.json({
      apiResponse:
        "Failed Spotify Request, check logs for full Spotify Request",
      spotifyResponseData: error.response.data
    });
  };
  next();
};
