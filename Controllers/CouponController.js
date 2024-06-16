const Coupon = require("../models/couponModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

//desc Get list of Coupons
// route Get /api/v1/coupon
//access Public
exports.getCoupons = getAll(Coupon);
// @desc Create new Coupon
// route POST /api/v1/coupon
// access Private /Admin and Manager
exports.createCoupon = createOne(Coupon);

// @desc   Get  Coupon By Id
// route Get /api/v1/coupon/:id
// access Public

exports.getCoupon = getOne(Coupon);

// @desc update Coupon
//@route PUT /api/v1/coupon/:id
//access private /Admin and Manager
exports.updateCoupon = updateOne(Coupon);

// @desc  Delete specific coupon
//@route Delete /api/v1/coupon/:id
//@access Private / Admin
exports.deleteCoupon = deleteOne(Coupon);
