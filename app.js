var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require('cookie-parser');
var logger = require("morgan");

const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const url = process.env.mongoUrl;
mongoose
  .connect(url)
  .then(() => {
    console.log("Successfully Connected to theMongodb Database..");
  })
  .catch(() => {
    console.log("Error Connected to the Mongodb Database...");
  });

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var draftJSRouter = require("./routes/draftJS");
var figureRouter = require("./routes/figure");

var cors = require("./routes/cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 },
  })
);

app.use("/", cors.corsWithOptions, indexRouter);
app.use("/users", cors.corsWithOptions, usersRouter);
app.use("/draftJS", cors.corsWithOptions, draftJSRouter);
app.use("/figure", cors.corsWithOptions, figureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
