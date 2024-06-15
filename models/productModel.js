const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name required"],
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [128, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      minlength: [20, "Too short product description"],
      maxlength: [500, "Too long product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Product cover image required"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must  belong  to a parent category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  options: { sort: { createdAt: -1 } },
});

productSchema.pre("/^find/", function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  this.populate({
    path: "subcategories",
    select: "name",
  });
  this.populate({
    path: "brand",
    select: "name",
  });
  next();
});
const setProductImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const images = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      image = images.push(imageUrl);
    });
    doc.images = images;
  }
};

productSchema.post("init", setProductImageUrl);
productSchema.post("save", setProductImageUrl);
module.exports = mongoose.model("Product", productSchema);
