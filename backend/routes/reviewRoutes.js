const express = require("express");
const router = express.Router();
const {
  addReview,
  getProductReviews,
} = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware.js");

router.post("/addReview/:productId", auth, addReview);
router.get("/getProductReviews/:productId", getProductReviews);

module.exports = router;
