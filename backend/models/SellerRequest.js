const mongoose = require("mongoose");

const SellerRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "AuthUser" },
    email: String,
    shopName: String,
    phone: String,
    category: String,
    description: String,
    panNumber: String,
    aadhaarNumber: String,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerRequest", SellerRequestSchema);
