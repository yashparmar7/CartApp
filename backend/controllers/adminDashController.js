const SellerRequest = require("../models/SellerRequest");

const getSellerRequests = async (req, res) => {
  try {
    const sellerRequests = await SellerRequest.find();
    res.status(200).json(sellerRequests);
  } catch (err) {
    res.status(500).json({
      message: "Error in fetching seller requests",
      error: err.message,
    });
  }
};

const updateSellerRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const sellerRequest = await SellerRequest.findById(id);
    if (!sellerRequest) {
      return res.status(404).json({ message: "Seller request not found" });
    }
    sellerRequest.status = status;
    await sellerRequest.save();
    res.status(200).json({ message: "Seller request updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error in updating seller request",
      error: err.message,
    });
  }
};

module.exports = {
  getSellerRequests,
  updateSellerRequest,
};
