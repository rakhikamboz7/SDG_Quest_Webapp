const bcrypt = require("bcryptjs")
const User = require("../models/user")
const generateToken = require("../utils/generateToken")

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if no role specified
      image: req.file ? req.file.path : null,
    })

    await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(400).json({ error: err.message })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token and send response
    const token = generateToken(user._id)

    res.json({
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

exports.getUserData = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    })
  } catch (err) {
    console.error("Get user data error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

// Additional controller methods for role-based functionality
exports.getAllUsers = async (req, res) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required." })
    }

    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    console.error("Get all users error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

exports.updateUserRole = async (req, res) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required." })
    }

    const { userId, role } = req.body

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" })
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "User role updated successfully",
      user,
    })
  } catch (err) {
    console.error("Update user role error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

exports.deactivateUser = async (req, res) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required." })
    }

    const { userId } = req.params

    const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "User deactivated successfully",
      user,
    })
  } catch (err) {
    console.error("Deactivate user error:", err)
    res.status(500).json({ error: "Server error" })
  }
}
