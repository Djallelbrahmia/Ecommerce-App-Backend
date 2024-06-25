const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const ApiError = require("../utils/ApiErrors");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { getAll, getOne } = require("./handlersFactory");

//desc create cash order
//@route POST /api/v1/orders/:cartId
//access Private/Protect
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("No cart for this cart id", 404));
  }
  const cartPrice = cart.totalPriceAferDiscount
    ? cart.totalPriceAferDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + shippingPrice + taxPrice;
  const order = await Order.create({
    user: req.user._id,
    orderitems: cart.cartitems,
    totalPrice: totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  if (order) {
    const bulkOption = cart.cartitems.map((cartItem) => ({
      updateOne: {
        filter: { _id: cartItem.product },
        update: {
          $inc: {
            quantity: -cartItem.quantity,
            sold: +cartItem.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "Success",
    data: order,
  });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = {
      user: req.user._id,
    };
  }
  next();
});

//desc get all Order
//@route GET /api/v1/orders/
//access Private/Protect
exports.getAllOrders = getAll(Order);

exports.getSpecificOrder = getOne(Order);

//desc update order status to paid
//@route PUT /api/v1/order/pay/:id
//access Private/Protect
exports.updateOrderStatusToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order for this order id", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();
  res.status(200).json({
    status: "Success",
    data: order,
  });
});

//desc update order status to delivered
//@route PUT /api/v1/order/delivre/:id
//access Private/Protect
exports.updateOrderStatusToDelivred = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order for this order id", 404));
  }

  order.delivredAt = Date.now();
  order.isDelivred = true;
  await order.save();
  res.status(200).json({
    status: "Success",
    data: order,
  });
});

//desc Get Checkout Session from stripe and send it as response
//@route PUT /api/v1/order/checkout-session/cartId
//access Private/Protect/user
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("No cart for this cart id", 404));
  }
  const totalOrderPrice = cart.totalPriceAferDiscount
    ? cart.totalPriceAferDiscount
    : cart.totalCartPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100, // Stripe expects amounts in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({
    status: "Success",
    data: session,
  });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  console.log("Checkout");
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(event);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});
