const { check } = require("express-validator");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review rating required")
    .isFloat({
      min: 1,
      max: 5,
    })
    .withMessage("Review rating must be between 1 and 5"),
  check("user")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (val, { req }) => {
      //check if logged user create a review before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("User already reviewed this product");
      }
    }),
  check("product")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("Product does not exist");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("Review does not exist");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are not allowed to update this review");
      }
      return true;
    }),
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review rating required")
    .isFloat({
      min: 1,
      max: 5,
    })
    .withMessage("Review rating must be between 1 and 5"),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("Review does not exist");
      }

      if (req.user.role === "user") {
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("You are not allowed to delete this review");
        }
      }
    }),
  validatorMiddleware,
];
