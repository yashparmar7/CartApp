const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: [
      {
        type: String,
        required: true,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s",
      },
    ],

    // SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },

    // PRICING
    pricing: {
      price: {
        type: Number,
        required: true,
      },
      mrp: {
        type: Number,
        required: true,
      },
      discountPercentage: {
        type: Number,
        default: 0,
      },
    },

    // RATINGS
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // OFFERS
    offers: [String],

    // DELIVERY
    delivery: {
      estimated: {
        type: String,
        default: "3-5 Days",
      },
      cost: {
        type: String,
        default: "Free",
      },
      codAvailable: {
        type: Boolean,
        default: true,
      },
    },

    // CATEGORY
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // INVENTORY
    stock: {
      type: Number,
      default: 0,
    },

    // ANALYTICS
    ordersCount: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    // STATUS & CONTROL
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "APPROVED", "REJECTED", "BLOCKED"],
      default: "PENDING",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    adminNote: {
      type: String,
      default: "",
    },

    statusUpdatedAt: {
      type: Date,
    },

    // TOP DEALS
    isTopDeal: {
      type: Boolean,
      default: false,
    },

    topDealStart: {
      type: Date,
    },

    topDealEnd: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (this.pricing?.mrp && this.pricing?.price) {
    this.pricing.discountPercentage = Math.round(
      ((this.pricing.mrp - this.pricing.price) / this.pricing.mrp) * 100
    );
  }
});

module.exports = mongoose.model("Product", productSchema);
