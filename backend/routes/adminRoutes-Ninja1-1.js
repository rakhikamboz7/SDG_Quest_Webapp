const express = require("express")
const { getAllUsers, resetUserScore } = require("../controllers/userController")
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

const router = express.Router()

// Apply both protect and adminOnly middleware to ensure only admins can access these routes
router.get("/admin/users", protect, adminOnly, getAllUsers)
router.post("/reset-score/:userId", protect, adminOnly, resetUserScore)

module.exports = router
