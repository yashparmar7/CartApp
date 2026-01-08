const express = require("express");
const router = express.Router();
const {
  getSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  updateSellerUserRole,
  deleteSellerRequest,
  getAllProductsAdmin,
} = require("../controllers/adminDashController");
const auth = require("../middleware/authMiddleware.js");

router.get("/seller-requests", auth, getSellerRequests);
router.patch("/seller-requests/:id/approve", auth, approveSellerRequest);
router.patch("/seller-requests/:id/reject", auth, rejectSellerRequest);

router.patch("/users/:id/role", auth, updateSellerUserRole);
router.delete("/seller-requests/:id", auth, deleteSellerRequest);

router.get("/getAllProductsAdmin", auth, getAllProductsAdmin);

module.exports = router;
