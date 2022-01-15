require("dotenv").config();

var express = require("express");
var cookieParser = require("cookie-parser");
var rateLimit = require("express-rate-limit");
var history = require("connect-history-api-fallback");
var authorizeRouter = require("./routes/authorize");
var userRouter = require("./routes/user");
var musicSessionRouter = require("./routes/music_session");
var guestRouter = require("./routes/guest");
var SpotifyErrorHandler = require("./middleware/SpotifyErrorHandler");
const bunyan = require("bunyan");
const {LoggingBunyan} = require("@google-cloud/logging-bunyan");
const gcloudLogger = new LoggingBunyan();

const logger = bunyan.createLogger({
  name: "default",
  streams: [
    process.env.NODE_ENV === "production" ? gcloudLogger.stream('info') : { stream: process.stdout, level: 'info' },
  ]
});

var app = express();

app.use((req, res, next) => {
  req.log = logger;
  next();
});

const path = __dirname + "/views/";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// rate-limit 100 requests per 1 minute
app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
}));

app.use(SpotifyErrorHandler);

app.use("/api/authorize", authorizeRouter);
userRouter.use("/:spotifyUserId/music_session", musicSessionRouter);
musicSessionRouter.use("/:musicSessionId/guest", guestRouter);
app.use("/api/user", userRouter);


app.use(history());
app.use(express.static(path, { etag: false, lastModified: false }));

/*
const httpsServer = https.createServer({
  key: fs.readFileSync(process.env.HTTPS_CERT_KEY),
  cert: fs.readFileSync(process.env.HTTPS_CERT),
}, app);
*/

let listener;
if (process.env.NODE_ENV === "development") {
  listener = app.listen(3000, function () {
    console.log("Listening on port " + listener.address().port);
  });
} else if (process.env.NODE_ENV === "production") {
  /*
  listener = httpsServer.listen(process.env.PORT, function() {
    console.log("Listening on port " + listener.address().port);
  });
  */
  listener = app.listen(process.env.PORT, function () {
    console.log("Listening on port " + listener.address().port);
  });
}


module.exports = app;
