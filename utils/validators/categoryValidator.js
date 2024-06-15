const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom(async (value) => {
      const categorie = await Category.findOne({ name: value });
      if (categorie) {
        throw new Error("Category already exists");
      }
      return true;
    }),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("id").isMongoId().withMessage("Invalid category id"),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];
