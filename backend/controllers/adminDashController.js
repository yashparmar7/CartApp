const SellerRequest = require("../models/SellerRequest");
const User = require("../models/User");
const Product = require("../models/Product");

const getSellerRequests = async (req, res) => {
  try {
    const sellerRequests = await SellerRequest.find()
      .populate({
        path: "user",
        select: "email userName role _id",
        model: "AuthUser",
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

    await User.findByIdAndUpdate(sellerRequest.user, { role: "SELLER" });

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
      .populate("seller", "user email shopName")
      .sort({ createdAt: -1 });
    // .populate("category", "name")

    console.log(products);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: err.message,
    });
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
module.exports = {
  getSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  updateSellerUserRole,
  deleteSellerRequest,
  getAllProductsAdmin,
};
