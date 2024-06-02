const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");

// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find();
  res.status(200).json({
    results: categories.length,
    data: categories,
  });
});
// @desc   Create category
// @route  Post /api/v1/categories
// @access private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
