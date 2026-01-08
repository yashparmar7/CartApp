const express = require("express");
const router = express.Router();
const {
  getSellerRequests,
  updateSellerRequest,
} = require("../controllers/adminDashController");
const auth = require("../middleware/authMiddleware.js");

router.get("/getSellerRequests", auth, getSellerRequests);
router.put("/updateSellerRequest/:id", auth, updateSellerRequest);

module.exports = router;
