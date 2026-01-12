const express = require("express");
const router = express.Router();
const {
  getMyProducts,
  createProduct,
} = require("../controllers/sellerDashController");
const auth = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploads");

router.get("/getMyProducts", auth, getMyProducts);
router.post(
  "/createProduct",
  auth,
  upload.array("images", 5),
  (err, req, res, next) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Upload error", error: err.message });
    }
    next();
  },
  createProduct
);

module.exports = router;
