const express = require("express")
const {
  registerUser,
  loginUser,
  getUserData,
  getAllUsers,
  updateUserRole,
  deactivateUser,
} = require("../controllers/userController")
const upload = require("../middleware/upload")
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

const router = express.Router()

// Public routes
router.post("/register", upload.single("image"), registerUser)
router.post("/login", loginUser)

// Protected routes (require authentication)
router.get("/user", protect, getUserData)

// Admin only routes
router.get("/admin/users", protect, adminOnly, getAllUsers)
router.put("/admin/user/role", protect, adminOnly, updateUserRole)
router.put("/admin/user/:userId/deactivate", protect, adminOnly, deactivateUser)

module.exports = router
