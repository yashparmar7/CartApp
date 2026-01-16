const express = require("express");

const {
  signupController,
  loginController,
  logoutController,
  verifyEmailController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/verify-email/:token", verifyEmailController);

module.exports = router;
