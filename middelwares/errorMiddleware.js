const ApiError = require("../utils/ApiErrors");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid Tokne please login again ...", 401);
const jwtExpiredHandler = () =>
  new ApiError("Expired Tokne please login again ...", 401);
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "dev") sendErrorForDev(err, res);
  if (process.env.NODE_ENV === "prod") {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = jwtExpiredHandler();

    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
