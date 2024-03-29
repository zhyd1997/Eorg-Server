const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const dotenv = require("dotenv");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler");

// load env vars
dotenv.config();

// connect to DB
db.connect();

// route files
const auth = require("./routes/auth");
const users = require("./routes/users");
// const draftJSRouter = require("./routes/draftJS");
const figures = require("./routes/figures");

const cors = require("./routes/cors");
const { AUTH_URI, USER_URI, FIGURE_URI } = require("./constants");
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

// senitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);

// prevent http params pollution
app.use(hpp());

// enable CORS
app.use(cors.cors);
app.options("*", cors.corsWithOptions);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use(AUTH_URI, auth);
app.use(USER_URI, users);
// app.use("/draftJS", cors.corsWithOptions, draftJSRouter);
app.use(FIGURE_URI, figures);

// error handler
app.use(errorHandler);

module.exports = app;
