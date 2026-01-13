const express = require("express");
const router = express.Router();
const {
  getSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  updateSellerUserRole,
  updateSellerProductStatus,
  deleteSellerRequest,
  getAllProductsAdmin,
  softDeleteSellerProduct,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
} = require("../controllers/adminDashController");
const auth = require("../middleware/authMiddleware.js");

router.get("/seller-requests", auth, getSellerRequests);
router.patch("/seller-requests/:id/approve", auth, approveSellerRequest);
router.patch("/seller-requests/:id/reject", auth, rejectSellerRequest);

router.patch("/users/:id/role", auth, updateSellerUserRole);
router.put("/products/:id/status", auth, updateSellerProductStatus);
router.put("/products/:id/softDelete", auth, softDeleteSellerProduct);

router.delete("/seller-requests/:id", auth, deleteSellerRequest);

router.get("/getAllProductsAdmin", auth, getAllProductsAdmin);

router.get("/getAllOrders", auth, getAllOrders);
router.put("/updateOrder/:id", auth, updateOrder);
router.delete("/deleteOrder/:id", auth, deleteOrder);
router.get("/getSingleOrder/:id", auth, getSingleOrder);

module.exports = router;
