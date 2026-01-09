const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware.js");

router.post("/createCategory", auth, createCategory);

router.get("/getAllCategories", getAllCategories);
router.put("/updateCategory/:id", auth, updateCategory);
router.delete("/deleteCategory/:id", auth, deleteCategory);

module.exports = router;
