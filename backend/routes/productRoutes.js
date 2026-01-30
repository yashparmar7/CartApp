const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const {
  createProduct,
  updateProduct,
  createCategory,
  getAllProducts,
  getSingleProduct,
  searchProducts,
  getTopDeals,
} = require("../controllers/productController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createProduct", upload.array("images", 5), auth, createProduct);
router.post("/createCategory", auth, createCategory);

router.get("/getAllProducts", getAllProducts);
router.get("/getSingleProduct/:id", getSingleProduct);

router.get("/searchProducts", searchProducts);
router.get("/top-deals", getTopDeals);

module.exports = router;
