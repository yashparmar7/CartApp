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

/* =====================================================
   GET ALL ORDERS (ADMIN)
===================================================== */
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.error("Get All Orders Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* =====================================================
   GET SINGLE ORDER (USER / ADMIN)
===================================================== */
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // user can only see their own order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Single Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   UPDATE ORDER STATUS (ADMIN)
===================================================== */
// const updateOrder = async (req, res) => {
//   try {
//     const { orderStatus, isPaid } = req.body;

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (orderStatus) {
//       order.orderStatus = orderStatus;

//       if (orderStatus === "delivered") {
//         order.deliveredAt = new Date();
//       }
//     }

//     if (isPaid !== undefined) {
//       order.isPaid = isPaid;
//       if (isPaid) {
//         order.paidAt = new Date();
//       }
//     }

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order updated successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Update Order Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* =====================================================
   DELETE ORDER (ADMIN)
===================================================== */
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     await order.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Order Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = {
  createOrder,
  getSingleOrder,
};
