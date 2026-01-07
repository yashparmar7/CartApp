const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware.js");

router.post("/addToCart", auth, addToCart);
router.get("/getCart", auth, getCart);
router.post("/removeFromCart", auth, removeFromCart);

module.exports = router;
