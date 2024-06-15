const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Brand = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const { uploadSingleImage } = require("../middelwares/uploadImageMiddleWare");

exports.uploadBrandImage = uploadSingleImage("image");
exports.reseizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
  }

  next();
});
//desc Get list of brand
// route Get /api/v1/brand
//access Public
exports.getBrands = getAll(Brand);
// @desc Create new brand
// route POST /api/v1/brand
// access Private /Admin and Manager
exports.createBrand = createOne(Brand);

// @desc   Get  brand By Id
// route Get /api/v1/brand/:id
// access Public

exports.getBrand = getOne(Brand);

// @desc update brand
//@route PUT /api/v1/brand/:id
//access private /Admin and Manager
exports.updateBrand = updateOne(Brand);

// @desc  Delete specific brand
//@route Delete /api/v1/brand/:id
//@access Private / Admin
exports.deleteBrand = deleteOne(Brand);
