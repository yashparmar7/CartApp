const express = require("express");
const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const auth = require("../middleware/authMiddleware.js");

router.get("/getWishlist", auth, getWishlist);
router.post("/addToWishlist/:id", auth, addToWishlist);
router.delete("/removeFromWishlist/:id", auth, removeFromWishlist);

module.exports = router;
