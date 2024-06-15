const express = require("express");

const {
  createReview,
  updateReview,
  getReview,
  getReviews,
  deleteReview,
  createFilterObject,
  setProductIdandUserIdToBody,
} = require("../Controllers/ReviewController");

const { protect, allowedTo } = require("../Controllers/AuthController");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/ReviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdandUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .delete(
    protect,
    allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  )
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .get(getReview);

module.exports = router;
