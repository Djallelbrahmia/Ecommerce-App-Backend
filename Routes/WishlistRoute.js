const express = require("express");
const {
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
} = require("../Controllers/WishlistController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();

router.use(protect, allowedTo("user"));
router.route("/").post(addProductToWishlist).get(getWishlist);
router.route("/:productId").delete(removeProductFromWishlist);
module.exports = router;
