var express = require("express");
var cookieParser = require("cookie-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const path = __dirname + "/views/";

app.use(express.static(path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

//app.use("/", indexRouter);

var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});
