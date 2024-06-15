const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");

const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./handlersFactory");
const { uploadmixOfImages } = require("../middelwares/uploadImageMiddleWare");

exports.uploadProductImages = uploadmixOfImages([
  { name: "imageCover", maxCount: 1 },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `productImageCover-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.files.imageCover.at(0).buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/products/${filename}`);
    req.body.imageCover = filename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const filename = `ProductImage-${uuidv4()}-${Date.now()}-[${index}].jpeg`;

        await sharp(req.files.imageCover.at(0).buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({
            quality: 90,
          })
          .toFile(`uploads/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});
// @desc   Get list of products
// @route Get /api/v1/product
//access Public
exports.getProducts = getAll(Product, "Products");
// @desc   Get  product By Id
// @route Get /api/v1/product/:id
//access Public
exports.getProduct = getOne(Product);
// @desc   Create product
//@route POST /api/v1/product
//access Private
exports.createProduct = createOne(Product);
// @desc  Update specific product
//@route PUT /api/v1/product
//Access private
exports.updateProduct = updateOne(Product);
//@desc delete a Product
//route delete /api/v1/product
//access private
exports.deleteProduct = deleteOne(Product);
