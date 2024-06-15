const mongoose = require("mongoose");
const { setImageUrl } = require("../utils/constants");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

brandSchema.post("init", setImageUrl);
brandSchema.post("save", setImageUrl);
const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
