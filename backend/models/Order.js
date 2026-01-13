const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["card", "upi", "cod"],
      required: true,
    },
    paymentId: String, // stripe / razorpay / upi txn id
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: addressSchema,
      required: true,
    },

    payment: {
      type: paymentSchema,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
