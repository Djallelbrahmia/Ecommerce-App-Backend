const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middelwares/validatorMiddleware");

const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subcategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .notEmpty()
    .withMessage("Product title is required"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 500 })
    .withMessage(" Too long Product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product prifeAferDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price < value)
        throw new Error("Price After discount must be lower than price ");
      return true;
    })
    .withMessage("Price After discount must be lower than price "),
  check("colors")
    .optional()
    .isArray()
    .withMessage("avaiable colors should be array of String"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of String"),
  check("category")
    .isMongoId()
    .withMessage("Category must be a valid MongoId")
    .custom(async (categoryId, { req }) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`Category Does not exist`);
      }
      return true;
    })
    .withMessage(`Category Does not exist`),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoId")
    .custom(async (subcategoriesIds, { req }) => {
      const subcategories = await Promise.all(
        subcategoriesIds.map((subcategoriesId) =>
          SubCategoryModel.findById(subcategoriesId)
        )
      );

      if (subcategories.some((value) => !value)) {
        throw new Error("One or more subcategories do not exist");
      }
    })
    .withMessage("One or more subcategories do not exist")
    .custom(async (subcategoriesId, { req }) => {
      const subcategoryIncluded = await SubCategoryModel.find({});
      const subcategoryIds = subcategoryIncluded.map((subcategory) =>
        subcategory._id.toString()
      );

      const isIncluded = subcategoriesId.every((value) =>
        subcategoryIds.includes(value)
      );
      if (!isIncluded) {
        throw new Error("All subcategories must belog to the category");
      }
      return true;
    })
    .withMessage("One or more subcategories don't belong to the main category"),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("brand must be a valid MongoId"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a valid number")
    .isLength({ min: 1 })
    .withMessage("Rating average must be above or equal to 1"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number "),

  check("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
  check("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
  validatorMiddleware,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
  validatorMiddleware,
];
