const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "SELLER", "USER"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: String,
    emailVerifyExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("AuthUser", UserSchema);

module.exports = User;
