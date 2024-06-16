const express = require("express");
const {
  addAdress,
  removeUserAdresse,
  getAdresses,
} = require("../Controllers/AdressesController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();

router.use(protect, allowedTo("user"));
router.route("/").post(addAdress).get(getAdresses);
router.route("/:adressId").delete(removeUserAdresse);
module.exports = router;
