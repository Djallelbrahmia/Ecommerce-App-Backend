const express = require("express");
const {
  getCart,
  addProductToCart,
  deleteItemFromUserCart,
  clearUserCart,
  updateItemQuantity,
  applyCoupon,
} = require("../Controllers/cartController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .get(getCart)
  .post(addProductToCart)
  .delete(clearUserCart)
  .put(applyCoupon);
router.route("/:id").delete(deleteItemFromUserCart).put(updateItemQuantity);
module.exports = router;
