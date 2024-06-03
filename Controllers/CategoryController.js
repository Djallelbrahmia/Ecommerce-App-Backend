const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/ApiErrors");

// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({
    results: categories.length,
    data: categories,
    page,
  });
});
// @desc   Get  category By Id
// @route  Get /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category)
    return next(new ApiError(`No Category for this id ${id}`, 404));
  res.status(200).json({ data: category });
});
// @desc   Create category
// @route  Post /api/v1/categories
// @access private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc  Update specific category
// @route  PUT /api/v1/categories/:id
// @access private

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category)
    return next(new ApiError(`No Category for this id ${id}`, 404));
  res.status(200).json({ data: category });
});
// @desc  Delete specific category
// @route  Delete /api/v1/categories/:id
// @access private
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.deleteOne({ _id: id });
  if (!category)
    return next(new ApiError(`No Category for this id ${id}`, 404));
  res.status(204).send();
});
