const express = require("express");
const router = express.Router();
const {
  createSellerRequest,
} = require("../controllers/sellerRequestController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createSellerRequest", auth, createSellerRequest);

module.exports = router;
