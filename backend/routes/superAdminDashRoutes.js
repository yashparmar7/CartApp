const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/superAdminDashController");
const auth = require("../middleware/authMiddleware.js");

router.get("/getAllUsers", auth, getAllUsers);
router.patch("/users/:id/role", auth, updateUserRole);
router.delete("/users/:id", auth, deleteUser);

module.exports = router;
