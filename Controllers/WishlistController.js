const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//desc add Product to wishlist
// route Post /api/v1/wishlist
//access Private /Protect(USER)
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added Successfuly to your wishlist",
    data: user.wishlist,
  });
});

//desc get all wishlist for user
// route Get /api/v1/wishlist
//access Private /Protect(USER)
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    data: user.wishlist,
    results: user.wishlist.length,
  });
});

//desc remove product from wishlist
// route Get /api/v1/wishlist
//access Private /Protect(USER)
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed Successfuly from your wishlist",
    data: user.wishlist,
  });
});
