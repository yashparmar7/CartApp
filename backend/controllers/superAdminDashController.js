const User = require("../models/User");

const ALLOWED_ROLES = ["USER", "SELLER", "ADMIN", "SUPERADMIN"];

const getAllUsers = async (req, res) => {
  try {
    if (!["SUPERADMIN"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const loggedInUserRole = req.user.role;
    const targetUserId = req.params.id;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.id === targetUserId) {
      return res.status(403).json({
        message: "You cannot change your own role",
      });
    }

    if (targetUser.role === "superadmin") {
      return res.status(403).json({
        message: "SuperAdmin role cannot be changed",
      });
    }

    if (loggedInUserRole === "admin" && role === "superadmin") {
      return res.status(403).json({
        message: "Admin cannot assign SuperAdmin role",
      });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: targetUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!["SUPERADMIN"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
