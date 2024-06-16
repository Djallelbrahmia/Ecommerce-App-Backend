const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./Routes/CategoryRoute");
const subCategoryRoute = require("./Routes/subCategoryRoute");
const brandRoute = require("./Routes/BrandRoute");
const productRoute = require("./Routes/ProductRoute");
const userRoute = require("./Routes/UserRoute");
const authRoute = require("./Routes/AuthRoute");
const reviewRoute = require("./Routes/ReviewRoute");
const wishlistRoute = require("./Routes/WishlistRoute");
const adressesRoute = require("./Routes/AdressesRoute");

const ApiError = require("./utils/ApiErrors");
const globalError = require("./middelwares/errorMiddleware");

dotenv.config({ path: "config.env" });
dbConnection();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/adresses", adressesRoute);

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
