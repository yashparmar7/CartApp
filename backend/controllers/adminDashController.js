const SellerRequest = require("../models/SellerRequest");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getSellerRequests = async (req, res) => {
  try {
    const sellerRequests = await SellerRequest.find()
      .populate({
        path: "user",
        select: "email userName role _id",
        model: "AuthUser",
      })
      .populate({
        path: "category",
        select: "name",
        model: "Category",
      })

      .lean();

    res.status(200).json(sellerRequests);
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching seller requests",
      error: err.message,
    });
  }
};

const approveSellerRequest = async (req, res) => {
  try {
    const sellerRequest = await SellerRequest.findById(req.params.id);
    if (!sellerRequest) return res.status(404).json({ message: "Not found" });

    sellerRequest.status = "APPROVED";
    await sellerRequest.save();

    await User.findByIdAndUpdate(sellerRequest.user, {
      role: "SELLER",
    });

    const updated = await SellerRequest.findById(req.params.id)
      .populate({
        path: "user",
        select: "email userName role _id",
        model: "AuthUser",
      })
      .lean();

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

const rejectSellerRequest = async (req, res) => {
  try {
    const sellerRequest = await SellerRequest.findById(req.params.id);
    if (!sellerRequest) return res.status(404).json({ message: "Not found" });

    sellerRequest.status = "REJECTED";
    await sellerRequest.save();

    await User.findByIdAndUpdate(sellerRequest.user, { role: "USER" });

    const updated = await SellerRequest.findById(req.params.id)
      .populate({
        path: "user",
        select: "email userName role _id",
        model: "AuthUser",
      })
      .lean();

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "userName email shopName")
      .sort({ createdAt: -1 })
      .populate("category", "name");

    // Calculate dynamic order count for each product
    const productsWithOrderCount = await Promise.all(
      products.map(async (product) => {
        const orderCount = await Order.countDocuments({
          "items.product": product._id,
        });
        return {
          ...product.toObject(),
          dynamicOrderCount: orderCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      products: productsWithOrderCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: err.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "userName email"
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

const updateSellerUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error in updating user role",
      error: err.message,
    });
  }
};

const updateSellerProductStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatus = ["PENDING", "APPROVED", "REJECTED", "BLOCKED"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (["REJECTED", "BLOCKED"].includes(status) && !adminNote?.trim()) {
      return res
        .status(400)
        .json({ message: "Admin note is required for reject or block" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    product.adminNote = adminNote || "";
    product.statusUpdatedAt = new Date();

    if (status === "APPROVED") {
      product.isActive = true;
      product.isDeleted = false;
    }

    if (status === "REJECTED" || status === "BLOCKED") {
      product.isActive = false;
      product.isDeleted = false;
    }

    await product.save();

    res.status(200).json({
      message: "Product status updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in updating product status",
      error: err.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderStatus, isPaid } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;

      if (orderStatus === "delivered") {
        order.deliveredAt = new Date();
      }
    }

    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = new Date();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteSellerRequest = async (req, res) => {
  try {
    const deleted = await SellerRequest.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({
      message: "Error in deleting seller request",
      error: err.message,
    });
  }
};

const softDeleteSellerProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isDeleted = true;
    product.status = "BLOCKED";
    product.isActive = false;
    product.adminNote = "Removed by admin";

    await product.save();

    res.status(200).json({
      message: "Product removed from store",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting product",
      error: err.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  updateSellerUserRole,
  updateSellerProductStatus,
  deleteSellerRequest,
  getAllProductsAdmin,
  softDeleteSellerProduct,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
};
