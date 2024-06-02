const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./Routes/CategoryRoute");
dotenv.config({ path: "config.env" });
dbConnection();
const app = express();
app.use(express.json());
app.use("/api/v1/categories", categoryRoute);
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));
const PORT = process.env.PORT;
app.listen(PORT || 3030, () => {
  console.log("App running");
});
