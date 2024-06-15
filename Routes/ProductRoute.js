const express = require("express");
const {
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  resizeProductImages,
  uploadProductImages,
} = require("../Controllers/ProductController");

const { protect, allowedTo } = require("../Controllers/AuthController");

const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();
router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  );
module.exports = router;
