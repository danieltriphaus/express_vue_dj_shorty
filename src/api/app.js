require("dotenv").config();

var express = require("express");
var https = require("https");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var rateLimit = require("express-rate-limit");
var authorizeRouter = require("./routes/authorize");
var userRouter = require("./routes/user");
var musicSessionRouter = require("./routes/music_session");
var guestRouter = require("./routes/guest");
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
musicSessionRouter.use("/:musicSessionId/guest", guestRouter);
app.use("/api/user", userRouter);


const httpsServer = https.createServer({
  key: fs.readFileSync(process.env.HTTPS_CERT_KEY),
  cert: fs.readFileSync(process.env.HTTPS_CERT),
}, app);


let listener;
if (process.env.NODE_ENV === "development") {
  listener = app.listen(3000, function () {
    console.log("Listening on port " + listener.address().port);
  });
} else if (process.env.NODE_ENV === "production") {
  listener = httpsServer.listen(process.env.PORT, function() {
    console.log("Listening on port " + listener.address().port);
  });
}


module.exports = app;
