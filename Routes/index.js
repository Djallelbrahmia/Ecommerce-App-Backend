const categoryRoute = require("./CategoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./BrandRoute");
const productRoute = require("./ProductRoute");
const userRoute = require("./UserRoute");
const authRoute = require("./AuthRoute");
const reviewRoute = require("./ReviewRoute");
const wishlistRoute = require("./WishlistRoute");
const adressesRoute = require("./AdressesRoute");
const couponRoute = require("./CouponRoute");
const cartRoute = require("./CartRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brand", brandRoute);
  app.use("/api/v1/product", productRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/review", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/adresses", adressesRoute);
  app.use("/api/v1/coupon", couponRoute);
  app.use("/api/v1/cart", cartRoute);
};

module.exports = mountRoutes;
