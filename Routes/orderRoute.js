const express = require("express");
const {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  filterOrderForLoggedUser,
  updateOrderStatusToPaid,
  updateOrderStatusToDelivred,
  getCheckoutSession,
} = require("../Controllers/OrderController");
const { protect, allowedTo } = require("../Controllers/AuthController");

const router = express.Router();
router.use(protect);
router.post("/:cartId", allowedTo("user"), createCashOrder);
router.get(
  "/",
  allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.route("/:id").get(getSpecificOrder);
router
  .route("/:id/pay")
  .put(allowedTo("admin", "manager"), updateOrderStatusToPaid);
router
  .route("/:id/delivre")
  .put(allowedTo("admin", "manager"), updateOrderStatusToDelivred);
router
  .route("/checkout-session/:cartId")
  .post(allowedTo("user"), getCheckoutSession);

module.exports = router;
