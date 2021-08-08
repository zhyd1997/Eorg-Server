const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const connectDB = require("./db");
const errorHandler = require("./middleware/errorHandler");

// load env vars
dotenv.config();

// connect to DB
connectDB();

// route files
const auth = require("./routes/auth");
// const indexRouter = require("./routes/index");
const users = require("./routes/users");
// const draftJSRouter = require("./routes/draftJS");
// const figureRouter = require("./routes/figure");

const cors = require("./routes/cors");
const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

// dev logger middleware
if (process.env.NODE_ENV === "development") {
	app.use(logger("dev"));
}

// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(
	session({
		secret: "secret",
		saveUninitialized: false,
		resave: false,
		cookie: { maxAge: 1000 },
	})
);

// mount routers
app.use("/api/v1/auth", cors.corsWithOptions, auth);
// app.use("/", cors.corsWithOptions, indexRouter);
app.use("/api/v1/users", cors.corsWithOptions, users);
// app.use("/draftJS", cors.corsWithOptions, draftJSRouter);
// app.use("/figure", cors.corsWithOptions, figureRouter);

// error handler
app.use(errorHandler);

module.exports = app;
