const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//desc add Adress to User model
// route Post /api/v1/adresses
//access Private /Protect
exports.addAdress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Adress added Successfuly",
    data: user.addresses,
  });
});

//desc get all adresses for user
// route Post /api/v1/adresses
//access Private /Protect
exports.getAdresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    data: user.addresses,
    results: user.addresses.length,
  });
});

//desc remove adress from user
// route delete /api/v1/adresses/:adressId
//access Private /Protect

exports.removeUserAdresse = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.adressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Adress removed Successfuly",
    data: user.addresses,
  });
});
