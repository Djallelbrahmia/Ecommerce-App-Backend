const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  reseizeImage,
} = require("../Controllers/CategoryController");
const { protect, allowedTo } = require("../Controllers/AuthController");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subcategoriesRoute = require("./subCategoryRoute");

const router = express.Router();
router.use("/:categoryId/subcategories", subcategoriesRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("manager", "admin"),
    uploadCategoryImage,
    reseizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo("manager", "admin"),
    uploadCategoryImage,
    reseizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);
module.exports = router;
