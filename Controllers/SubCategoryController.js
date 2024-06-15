const subCategoryModel = require("../models/subcategoryModel");
const subcategoryModel = require("../models/subcategoryModel");
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
// @desc   Get list of categories
// @route POST api/v1/subcategory
// @access private /Admin and Manager
exports.createSubCategory = createOne(subcategoryModel);
// @desc   Get list of subcategories
// @route  Get /api/v1/subcategories
// @access Public
exports.getSubCategories = getAll(subcategoryModel);
// Nested route
//Route Get /api/v1/categories/:categoryId/subcategories

// @desc   Get  subcategory By Id
// @route Get /api/v1/subcategories/:id
// @access Public
exports.getSubCategory = getOne(subCategoryModel);

// @desc  Update specific subcategory
// @route PUT /api/v1/subcategories
// @access Private /Admin and Manager
exports.updateSubCategory = updateOne(subCategoryModel);

// @desc  Delete specific subcategory
// @route DELETE /api/v1/subcategories
// @access Private /Admin
exports.deleteSubCategory = deleteOne(subCategoryModel);
