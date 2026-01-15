const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, payment } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const validProducts = cart.products.filter((item) => item.product);

    if (validProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart contains unavailable products" });
    }

    const orderItems = validProducts.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.image?.[0],
      price: item.product.pricing.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      payment,
      totalAmount,
      isPaid: payment.method === "cod" ? false : true,
      paidAt: payment.method === "cod" ? null : new Date(),
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.products = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id.toString();

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled after shipping",
      });
    }

    order.orderStatus = "cancelled";

    // 💸 Refund placeholder (important for paid orders)
    if (order.isPaid) {
      // TODO: Integrate Razorpay / Stripe refund here
      // refundStatus = "initiated"
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
};
