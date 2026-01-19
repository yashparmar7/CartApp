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
    <div style="background:#f9fafb;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#ef4444;padding:24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">
            Email Verification
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px;color:#374151;">
          <h2 style="margin-top:0;font-size:18px;">
            Hey ${userName} 👋
          </h2>

          <p style="font-size:14px;line-height:1.6;">
            Thanks for signing up! You’re just one step away from getting started.
            Click the button below to verify your email address.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${verifyUrl}"
              style="
                background:#ef4444;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                border-radius:8px;
                font-weight:600;
                display:inline-block;
              ">
              Verify Email
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;">
             This link expires in <strong>24 hours</strong>.
          </p>

          <p style="font-size:13px;color:#6b7280;">
            If you didn’t create this account, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </div>

      </div>
    </div>
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
      return res.status(400).json({ error: "Email is already verified" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email - Resent",
      html: `
    <div style="background:#f9fafb;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#ef4444;padding:24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">
            Email Verification
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px;color:#374151;">
          <h2 style="margin-top:0;font-size:18px;">
            Hey ${userName} 👋
          </h2>

          <p style="font-size:14px;line-height:1.6;">
            Thanks for signing up! You’re just one step away from getting started.
            Click the button below to verify your email address.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${verifyUrl}"
              style="
                background:#ef4444;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                border-radius:8px;
                font-weight:600;
                display:inline-block;
              ">
              Verify Email
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;">
            This link expires in <strong>24 hours</strong>.
          </p>

          <p style="font-size:13px;color:#6b7280;">
            If you didn’t create this account, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </div>

      </div>
    </div>
  `,
    });

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Failed to send verification email" });
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
  resendVerificationEmailController,
};
