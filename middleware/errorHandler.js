const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);

  switch (err.name) {
    // Mongoose bad ObjectId
    case "CastError":
      error = new ErrorResponse("Resource not found", 400);
      break;

    // Mongoose duplicate key
    case "MongoError":
      error = new ErrorResponse(
        `Duplicate field value entered: ${Object.keys(err.keyPattern)}`,
        400
      );
      break;

    // Mongoose validation error
    case "ValidationError":
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new ErrorResponse(message, 400);
      break;

    default:
      break;
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;
