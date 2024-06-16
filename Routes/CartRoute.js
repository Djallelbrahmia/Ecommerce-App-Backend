const express = require("express");
const { getCart, addProductToCart } = require("../Controllers/cartController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").get(getCart).post(addProductToCart);

module.exports = router;
