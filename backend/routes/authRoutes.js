const express = require("express");

const {
  signupController,
  loginController,
  logoutController,
  verifyEmailController,
  resendVerificationEmailController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/verify-email/:token", verifyEmailController);
router.post(
  "/resend-verification-email/:token",
  resendVerificationEmailController,
);

module.exports = router;
