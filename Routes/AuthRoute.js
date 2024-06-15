const express = require("express");
const {
  signUp,
  signIn,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../Controllers/AuthController");

const {
  signUpValidator,
  signInValidator,
  forgetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();
router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.post("/forget-password", forgetPasswordValidator, forgetPassword);
router.post("/verify-reset-code", verifyPasswordResetCode);
router.post("/reset-password", resetPassword);
module.exports = router;
