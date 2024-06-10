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
    uploadCategoryImage,
    reseizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    reseizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
