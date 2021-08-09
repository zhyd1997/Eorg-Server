const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./db");
const errorHandler = require("./middleware/errorHandler");

// load env vars
dotenv.config();

// connect to DB
connectDB();

// route files
const auth = require("./routes/auth");
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

// enable CORS
app.use(cors.cors);
app.options("*", cors.corsWithOptions);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
// app.use("/draftJS", cors.corsWithOptions, draftJSRouter);
// app.use("/figure", cors.corsWithOptions, figureRouter);

// error handler
app.use(errorHandler);

module.exports = app;
