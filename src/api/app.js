require("dotenv").config();

var express = require("express");
var cookieParser = require("cookie-parser");
var rateLimit = require("express-rate-limit");
var authorizeRouter = require("./routes/authorize");
var userRouter = require("./routes/user");
var musicSessionRouter = require("./routes/music_session");
var SpotifyErrorHandler = require("./middleware/SpotifyErrorHandler");

var app = express();

const path = __dirname + "/views/";

app.use(express.static(path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(SpotifyErrorHandler);

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.use("/api/authorize", authorizeRouter);
userRouter.use("/:spotifyUserId/music_session", musicSessionRouter);
app.use("/api/user", userRouter);

var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});

module.exports = app;
