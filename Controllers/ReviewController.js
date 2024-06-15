const Review = require("../models/reviewModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

exports.setProductIdandUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;

  next();
};
//desc Get list of Review
// route Get /api/v1/review
//access Public
exports.getReviews = getAll(Review);

// @desc Create new Review
// route POST /api/v1/review
// access Private /Protect /User
exports.createReview = createOne(Review);

// @desc   Get  review By Id
// route Get /api/v1/review/:id
// access Public

exports.getReview = getOne(Review);

// @desc update Review
//@route PUT /api/v1/review/:id
// access Private/Protect /User

exports.updateReview = updateOne(Review);

// @desc  Delete specific Review
//@route Delete /api/v1/Review/:id
// access Private/Protect /User  /admin manager
exports.deleteReview = deleteOne(Review);
