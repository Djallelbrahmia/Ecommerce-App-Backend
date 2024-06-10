const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");

const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const { uploadSingleImage } = require("../middelwares/uploadImageMiddleWare");

exports.uploadCategoryImage = uploadSingleImage("image");
exports.reseizeImage = asyncHandler(async (req, res, next) => {
  const filename = `categorie-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }

  next();
});
// @desc   Get list of categories
// @route  Get /api/v1/categories
// @access Public
exports.getCategories = getAll(Category);
// @desc   Get  category By Id
// @route  Get /api/v1/categories/:id
// @access Public
exports.getCategory = getOne(Category);
// @desc   Create category
// @route  Post /api/v1/categories
// @access private
exports.createCategory = createOne(Category);

// @desc  Update specific category
// @route  PUT /api/v1/categories/:id
// @access private

exports.updateCategory = updateOne(Category);
// @desc  Delete specific category
// @route  Delete /api/v1/categories/:id
// @access private
exports.deleteCategory = deleteOne(Category);
