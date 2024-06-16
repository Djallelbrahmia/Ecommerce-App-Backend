const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const ApiError = require("../utils/ApiErrors");

const calcTotalCartPrice = (cart) => {
  let totalCartPrice = 0;
  cart.cartitems.forEach((item) => {
    totalCartPrice += item.price * item.quantity;
  });
  return totalCartPrice;
};
// @desc   Get user cart
// @route  Get /api/v1/cart
// @access Private/Protect
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart for this user", 404));
  }
  res.status(200).json({
    status: "Success",
    data: cart,
  });
});

// @desc   add Product to cart
// @route  POST /api/v1/cart
// @access Private/Protect
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartitems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productExists = cart.cartitems.findIndex(
      (item) =>
        item.product.toString() === productId && item.color === req.body.color
    );
    if (productExists > -1) {
      cart.cartitems[productExists].quantity += 1;
    } else {
      cart.cartitems.push({
        product: productId,
        color,
        price: product.price,
      });
    }

    cart.totalCartPrice = calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({
      status: "Success",
      data: cart,
    });
  }
});
