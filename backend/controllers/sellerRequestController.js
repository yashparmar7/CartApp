const SellerRequest = require("../models/SellerRequest");

const createSellerRequest = async (req, res) => {
  try {
    const sellerRequest = await SellerRequest.create(req.body);
    res.status(201).json({ message: "Seller request created successfully" });
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
