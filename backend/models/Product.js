const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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

    offers: [String],

    delivery: {
      estimated: {
        type: String,
        default: "3-5 Days",
      },
      cost: {
        type: String,
        default: "Free",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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
