const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

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
    numberOfItems: cart.cartitems.length,
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
  }
  cart.totalCartPrice = calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numberOfItems: cart.cartitems.length,

    data: cart,
  });
});

// @desc   Delete Product from user  cart
// @route  Delete /api/v1/cart/:id
// @access Private/Protect

exports.deleteItemFromUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart for this user", 404));
  }
  cart.cartitems = cart.cartitems.filter(
    (item) => item._id.toString() !== req.params.id
  );
  cart.totalCartPrice = calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numberOfItems: cart.cartitems.length,
    data: cart,
  });
});

// @desc   Delete Product from user  cart
// @route  Delete /api/v1/cart/
// @access Private/Protect
exports.clearUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart for this user", 404));
  }
  cart.cartitems = [];
  cart.totalCartPrice = 0;
  await cart.save();
  res.status(200).json({
    status: "Success",
    data: cart,
  });
});

// @desc   Update item Quantity
// @route  Put /api/v1/cart/
// @access Private/Protect

exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart for this user", 404));
  }
  cart.cartitems = cart.cartitems.map((item) => {
    if (item._id.toString() === req.params.id) {
      item.quantity = req.body.quantity;
    }
    return item;
  });
  cart.totalCartPrice = calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    numberOfItems: cart.cartitems.length,
    data: cart,
  });
});

// @desc   Apply Coupon on logged user  cart
// @route  PUT /api/v1/cart/aaplycoupon
// @access Private/Protect

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart for this user", 404));
  }
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 404));
  }

  const totalCartPrice = calcTotalCartPrice(cart);
  //Calculate total price after discount
  const totalPriceAferDiscount = (
    totalCartPrice -
    (totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalCartPrice = totalCartPrice;
  cart.totalPriceAferDiscount = totalPriceAferDiscount;

  await cart.save();
  res.status(200).json({
    status: "Success",
    numberOfItems: cart.cartitems.length,
    data: cart,
    totalCartPrice,
    totalPriceAferDiscount,
  });
});
