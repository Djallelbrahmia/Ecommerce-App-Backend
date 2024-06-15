const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../Controllers/SubCategoryController");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subcategoryValidator");
const { protect, allowedTo } = require("../Controllers/AuthController");

//merge params allow us to  access parameters on other routers
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
