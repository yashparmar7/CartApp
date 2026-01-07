const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createProduct", upload.array("images", 5), auth, createProduct);

router.get("/getAllProducts", getAllProducts);
router.get("/getSingleProduct/:id", auth, getSingleProduct);

module.exports = router;
