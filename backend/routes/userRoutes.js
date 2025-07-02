const express = require("express")
const router = express.Router()

// Import controllers
const {
  registerUser,
  loginUser,
  getUserData,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  createAdminUser,
} = require("../controllers/userController")

// Import middleware
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

// ✅ DEBUG: Log when routes are being registered
console.log("🔧 Registering user routes...")

// ✅ PUBLIC ROUTES - No authentication required
router.post(
  "/register",
  (req, res, next) => {
    console.log("📝 Registration attempt:", req.body.email)
    next()
  },
  registerUser,
)

router.post(
  "/login",
  (req, res, next) => {
    console.log("🔐 Login attempt:", req.body.email)
    next()
  },
  loginUser,
)

// ✅ SECURE: Admin creation route - MAKE SURE THIS IS HERE
router.post(
  "/create-admin",
  (req, res, next) => {
    console.log("🔧 Admin creation attempt with secret:", req.body.adminSecret ? "PROVIDED" : "MISSING")
    next()
  },
  createAdminUser,
)

// ✅ Test route to verify routes are working
router.get("/test", (req, res) => {
  res.json({
    message: "User routes are working!",
    availableRoutes: [
      "POST /register",
      "POST /login",
      "POST /create-admin",
      "GET /test",
      "GET /user (protected)",
      "GET /admin/users (admin only)",
      "PUT /admin/user-role (admin only)",
      "PUT /admin/deactivate/:userId (admin only)",
    ],
  })
})

// ✅ PROTECTED ROUTES - Require authentication
router.get("/user", protect, getUserData)

// ✅ ADMIN-ONLY ROUTES - Require authentication + admin role
router.get("/admin/users", protect, adminOnly, getAllUsers)
router.put("/admin/user-role", protect, adminOnly, updateUserRole)
router.put("/admin/deactivate/:userId", protect, adminOnly, deactivateUser)

console.log("✅ User routes registered successfully")

module.exports = router
