const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User required"],
  },
  cartitems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity required"],
        default: 1,
      },
      color: String,
      price: Number,
    },
  ],
  totalCartPrice: Number,
  totalPriceAferDiscount: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
