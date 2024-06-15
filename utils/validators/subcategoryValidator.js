const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name"),
  check("category")
    .isMongoId()
    .withMessage("Invalid category id")
    .notEmpty()
    .withMessage("category must be not empty"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name"),
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];
