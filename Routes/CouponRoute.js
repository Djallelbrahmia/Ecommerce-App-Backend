const express = require("express");
const {
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  createCoupon,
} = require("../Controllers/CouponController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();
router.use(protect, allowedTo("manager", "admin"));
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
