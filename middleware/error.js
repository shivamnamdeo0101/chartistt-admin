const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };


  console.log("error from Error response",error)

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Server Error`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log(error.message);

  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || "Server Error",
  });
};

module.exports = errorHandler;