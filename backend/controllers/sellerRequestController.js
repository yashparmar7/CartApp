const SellerRequest = require("../models/SellerRequest");
const User = require("../models/User");

const createSellerRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "SELLER") {
      return res.status(400).json({ message: "You are already a seller" });
    }

    const existingRequest = await SellerRequest.findOne({
      user: userId,
      status: { $in: ["PENDING", "APPROVED"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Seller request already exists",
      });
    }

    const sellerRequest = await SellerRequest.create({
      ...req.body,
      user: userId,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Seller request created successfully",
      data: sellerRequest,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in creating seller request",
      error: err.message,
    });
  }
};

module.exports = {
  createSellerRequest,
};
