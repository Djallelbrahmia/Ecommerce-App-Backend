const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signUpValidator = [
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

  validatorMiddleware,
];

exports.signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email"),
  check("password").notEmpty().withMessage("User password required"),

  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email required")
    .isEmail()
    .withMessage("Invalid email"),

  validatorMiddleware,
];
