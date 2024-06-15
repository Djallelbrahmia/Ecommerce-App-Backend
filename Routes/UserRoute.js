const express = require("express");
const {
  getUsers,

  getUser,
  updateUser,
  deleteUser,
  createUser,
  uploadUserImage,
  reseizeImage,
  changeUserPassword,
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  desactivateLoggedUser,
} = require("../Controllers/UserController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();
// update-password
router.get("/getMe", protect, getLoggedUser, getUser);
router.delete("/deleteMe", protect, desactivateLoggedUser);
router.put("/update-my-password", protect, updateLoggedUserPassword);
router.put(
  "/updateMe",
  protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);

router.put(
  "/change-password/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(protect, allowedTo("admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    reseizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUser)
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    reseizeImage,
    updateUserValidator,
    updateUser
  );
module.exports = router;
