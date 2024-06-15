const express = require("express");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  reseizeImage,
} = require("../Controllers/BrandController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();
router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImage,
    reseizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadBrandImage,
    reseizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
