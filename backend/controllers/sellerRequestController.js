const SellerRequest = require("../models/SellerRequest");

const createSellerRequest = async (req, res) => {
  try {
    const existingRequest = await SellerRequest.findOne({
      user: req.body.user,
    });
    if (existingRequest && existingRequest.status === "PENDING") {
      return res
        .status(400)
        .json({ message: "You already have a pending request." });
    }

    const sellerRequest = await SellerRequest.create(req.body);
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
