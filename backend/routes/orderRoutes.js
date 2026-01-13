const express = require("express");
const router = express.Router();
const {
  createOrder,
  getSingleOrder,
} = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createOrder", auth, createOrder);

router.get("/getSingleOrder/:id", auth, getSingleOrder);

module.exports = router;
