const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// const signupController = async (req, res) => {
//   const { userName, email, password } = req.body;

//   try {
//     if (!userName || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       userName,
//       email,
//       password: hashedPassword,
//     });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: user._id,
//         userName: user.userName,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

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
      emailVerifyToken: verifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Hey ${userName} 👋</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours</p>
      `,
    });

    res.status(201).json({
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({ error: "User does not exist" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email first",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
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
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  verifyEmailController,
};
