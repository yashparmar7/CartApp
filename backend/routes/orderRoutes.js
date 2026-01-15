const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  cancelOrder,
} = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createOrder", auth, createOrder);

router.get("/getUserOrders", auth, getUserOrders);
router.put("/cancelOrder/:id", auth, cancelOrder);

module.exports = router;
