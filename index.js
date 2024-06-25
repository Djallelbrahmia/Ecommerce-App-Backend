const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const { type } = require("os");

const cors = require("cors");
const compression = require("compression");
const express = require("express");

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
//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
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
