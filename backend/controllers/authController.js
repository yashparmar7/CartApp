const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, sendVerificationEmail } = require("../utils/sendEmail");

const signupController = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is missing in environment variables");
    }

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    res.status(201).json({
      message: "Signup successful. Please verify your email.",
    });

    sendVerificationEmail(email, userName, verifyUrl)
      .then(() => {
        console.log("Verification email sent to:", email);
      })
      .catch((err) => {
        console.error("EMAIL ERROR:", err);
      });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      error: error.message || "Server error",
    });
  }
};

const verifyEmailController = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    res.status(500).json({
      error: error.message || "Server error",
    });
  }
};

const resendVerificationEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Email already verified",
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is missing in environment variables");
    }

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    res.status(200).json({
      message: "Verification email sent successfully",
    });

    // Send email async
    sendVerificationEmail(email, user.userName, verifyUrl)
      .then(() => {
        console.log("Resent verification email to:", email);
      })
      .catch((err) => {
        console.error("RESEND EMAIL ERROR:", err);
      });
  } catch (error) {
    console.error("RESEND VERIFY ERROR:", error);
    res.status(500).json({
      error: error.message || "Server error",
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "invalid credential" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email first",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "invalid credential" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      error: error.message || "Server error",
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  signupController,
  verifyEmailController,
  resendVerificationEmailController,
  loginController,
  logoutController,
};
