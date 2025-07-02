// NEW FILE - This handles the /api/login and /api/register routes
const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserData,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  createAdminUser,
} = require("../controllers/authController") // New controller

const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

// ✅ NEW SECURE AUTHENTICATION ROUTES
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/user", protect, getUserData)

// ✅ ADMIN ROUTES
router.get("/admin/users", protect, adminOnly, getAllUsers)
router.put("/admin/user-role", protect, adminOnly, updateUserRole)
router.put("/admin/deactivate/:userId", protect, adminOnly, deactivateUser)
router.post("/create-admin", createAdminUser)

module.exports = router
