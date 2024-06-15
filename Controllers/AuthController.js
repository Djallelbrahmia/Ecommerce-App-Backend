const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiErrors");
const sendEmail = require("../utils/sendEmail");

const { createToken } = require("../utils/createToken");

// @desc Sign up a user
// route POST /api/v1/auth/signup
// access public
exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  const token = createToken({ userId: user.id });
  res.status(201).json({
    data: user,
    token,
  });
});

// @desc Sign in a user
// route POST /api/v1/auth/signin
// access public
exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!isMatch) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken({ userId: user.id });

  res.status(201).json({
    data: user,
    token,
  });
});
//desc Authenticate a user
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not loged in , please login to access this route",
        401
      )
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token  does no longer exist",
        401
      )
    );
  }
  if (currentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User recently changed password please login again ", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

//desc Authorization
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc forget password
// route POST /api/v1/auth/forgot-password
// access public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("No user with this email", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwrodResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code -Valid for 10min",
      message: `Your password reset code is ${resetCode} `,
    });
  } catch (e) {
    user.passwrodResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError("There was an error sending your password reset code", 500)
    );
  }
  res.status(200).json({
    status: "Success",
    message: "Reset code sent to your email",
  });
});

// @desc Verify  password code
// route POST /api/v1/auth/verify-reset-code
// access public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwrodResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "Success",
    message: "Password reset code verified",
  });
});

//desc Reset Password
// @route POST /api/v1/reset-password
//access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("No user with this email", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Password reset code is not verified", 400));
  }
  if (user.passwordResetExpires < Date.now()) {
    return next(new ApiError("Password reset code is expired", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = createToken({ userId: user.id });

  res.status(200).json({
    status: "Success",
    message: "Password reset successful",
    token,
  });
});
