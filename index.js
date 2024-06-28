const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const cors = require("cors");
const compression = require("compression");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const morgan = require("morgan");
const dbConnection = require("./config/database");
const { webhookCheckout } = require("./Controllers/OrderController");

const mountRoutes = require("./Routes/index");
const ApiError = require("./utils/ApiErrors");
const globalError = require("./middelwares/errorMiddleware");

dbConnection();
const app = express();
app.use(cors());
app.use(compression());
// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    webhookCheckout(req, res, next);
  }
);

app.use(
  express.json({
    limit: "20kb",
  })
);

//Security
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

app.use(express.static(path.join(__dirname, "uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
  limit: 100,
});
app.use("/api", limiter);
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});
//Global error handling middleware
app.use(globalError);
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));
const { PORT } = process.env;
const server = app.listen(PORT || 3030, () => {
  // eslint-disable-next-line no-console
  console.log("App running");
});
process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.error("unhandledRejection: ", err.name, "|", err.message);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.error("Shutting down ...");
    process.exit(1);
  });
});
