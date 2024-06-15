const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name").notEmpty().withMessage("User name required"),
  check("email")
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    })
    .withMessage("User already exists"),
  check("password")
    .notEmpty()
    .withMessage("User password required")
    .isLength({
      min: 6,
    })
    .withMessage("User password must be at least 6 characters"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("passwordConfirm")
    .custom((val, { req }) => {
      if (req.body.password !== val) throw new Error("Password does not match");
      return true;
    })
    .withMessage("User password confirmation does not match")
    .notEmpty()
    .withMessage("User password Confirmation Required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("User phone must be a valid Dz phone number"),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("User password required")
    .isLength({
      min: 6,
    })
    .withMessage("User password must be at least 6 characters")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User does not exist");
      }
      const isMatch = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      );
      if (!isMatch) {
        throw new Error("Incorrect current password");
      }
    }),
  check("currentpassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  check("id").isMongoId().withMessage("Invalid User id"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must confirm your password")
    .custom((val, { req }) => {
      if (req.body.password !== val) throw new Error("Password does not match");
      return true;
    }),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("name").optional().notEmpty().withMessage("User name required"),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    })
    .withMessage("User already exists"),
  check("password")
    .optional()
    .notEmpty()
    .withMessage("User password required")
    .isLength({
      min: 6,
    })
    .withMessage("User password must be at least 6 characters"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("User phone must be a valid Dz phone number"),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name").optional().notEmpty().withMessage("User name required"),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    })
    .withMessage("User already exists"),

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("User phone must be a valid Dz phone number"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorMiddleware,
];
