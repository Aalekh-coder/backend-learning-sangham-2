// customer error class

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "Api Error";
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorhandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  } else if (err.name === "validationError") {
    return res.status(400).json({
      status: "error",
      message: "validation Error",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "An unExpected error occured",
    });
  }
};

module.exports = {
  ApiError,
  asyncHandler,
  globalErrorhandler,
};
