const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./Routes/CategoryRoute");
const ApiError = require("./utils/ApiErrors");
const globalError = require("./middelwares/errorMiddleware");
dotenv.config({ path: "config.env" });
dbConnection();
const app = express();
app.use(express.json());
app.use("/api/v1/categories", categoryRoute);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});
//Global error handling middleware
app.use(globalError);
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));
console.log(process.env.PORT);
const PORT = process.env.PORT;
app.listen(PORT || 3030, () => {
  console.log("App running");
});
