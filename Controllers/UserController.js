const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { createOne, getOne, getAll } = require("./handlersFactory");
const { uploadSingleImage } = require("../middelwares/uploadImageMiddleWare");
const ApiError = require("../utils/ApiErrors");
const { createToken } = require("../utils/createToken");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.reseizeImage = asyncHandler(async (req, res, next) => {
  const filename = `profileImg-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/users/${filename}`);
    req.body.image = filename;
  }

  next();
});

//desc Get list of users
// route Get /api/v1/user
//access Public
exports.getUsers = getAll(User);

// @desc Create new user
// route POST /api/v1/user
// access Private
exports.createUser = createOne(User);

// @desc   Get  user By Id
// route Get /api/v1/user/:id
// access Public
exports.getUser = getOne(User);

// @desc update user
//@route PUT /api/v1/user/:id
//access private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!document) return next(new ApiError(`No ${User} for this id ${id}`, 404));
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const document = await User.findByIdAndUpdate(
    { _id: id },
    {
      password,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) return next(new ApiError(`No ${User} for this id ${id}`, 404));
  res.status(200).json({ data: document });
});
// @desc  Delete specific user
//@route Delete /api/v1/user/:id
//@access Private /Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    active: false,
  });
  res.status(201).json({
    data: user,
  });
});

// @desc   Loged user data
// route Get /api/v1/user/getMe
// access Private /Protect

exports.getLoggedUser = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// @desc  update user password
// route PUT /api/v1/user/update-my-password
// access Private /Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken({ userId: user.id });
  res.status(200).json({ data: user, token });
});
// @desc  update user information
// route PUT /api/v1/user/updateMe
// access Private /Protect

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: user });
});

// @desc  desactivate logged  user
// route Delete /api/v1/user/deleteMe
// access Private /Protect
exports.desactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(204).json({
    message: "success",
  });
});
