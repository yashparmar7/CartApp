const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
  updateQuantity,
} = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware.js");

router.post("/addToCart", auth, addToCart);
router.get("/getCart", auth, getCart);
router.post("/removeFromCart", auth, removeFromCart);
router.post("/updateQuantity", auth, updateQuantity);

module.exports = router;
