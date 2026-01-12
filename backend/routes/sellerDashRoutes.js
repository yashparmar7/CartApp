const express = require("express");
const router = express.Router();
const {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
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

router.put(
  "/updateProduct/:id",
  auth,
  upload.array("images", 5),
  updateProduct
);

router.delete("/deleteProduct/:id", auth, deleteProduct);

module.exports = router;
