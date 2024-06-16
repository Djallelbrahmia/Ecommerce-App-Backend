const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name required"],
      trim: true,
      unique: [true, "Coupon must be unique"],
      minlength: [3, "Too short coupon name"],
      maxlength: [32, "Too long coupon name"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire date required"],
      min: Date.now(),
    },

    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
      min: 0,
      max: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
