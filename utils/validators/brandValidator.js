const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 3 }),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("name").optional().notEmpty().withMessage("Brand name required"),
  check("id").isMongoId().withMessage("Invalid brand id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validatorMiddleware,
];
