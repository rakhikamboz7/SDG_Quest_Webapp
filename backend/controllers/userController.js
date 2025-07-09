const bcrypt = require("bcryptjs")
const User = require("../models/user")
const generateToken = require("../utils/generateToken")

// ✅ Register User
exports.registerUser = async (req, res) => {
  console.log("📝 Registration request received:", req.body)

  const { name, email, password } = req.body

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

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

    // Create new user - ALWAYS as 'user' role
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // ✅ Hardcoded - no role from frontend
      isActive: true,
    })

    await newUser.save()
    console.log("✅ User registered successfully:", email)

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
    console.error("❌ Registration error:", err)
    res.status(500).json({ error: err.message })
  }
}

// ✅ Login User
exports.loginUser = async (req, res) => {
  console.log("🔐 Login request received:", req.body.email)

  const { email, password } = req.body

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      console.log("❌ User not found:", email)
      return res.status(404).json({ error: "User not found" })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    console.log("✅ Login successful:", email, "Role:", user.role)

    res.json({
      message: "Login successful",
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
    console.error("❌ Login error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

// ✅ Get User Data
exports.getUserData = async (req, res) => {
  try {
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

// ✅ Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    console.error("Get all users error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

// ✅ Update User Role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" })
    }

    // Prevent self-role modification
    if (req.user.id === userId) {
      return res.status(403).json({ error: "Cannot modify your own role" })
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

// ✅ Deactivate User (Admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params

    // Prevent self-deactivation
    if (req.user.id === userId) {
      return res.status(403).json({ error: "Cannot deactivate your own account" })
    }

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

// ✅ Create Admin User
exports.createAdminUser = async (req, res) => {
  try {
    const { adminSecret } = req.body

    // Check admin secret
    if (adminSecret !== process.env.ADMIN_CREATION_SECRET) {
      return res.status(403).json({ error: "Invalid admin secret" })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD 

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin user already exists" })
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const adminUser = new User({
      name: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    })

    await adminUser.save()

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    })
  } catch (err) {
    console.error("Create admin error:", err)
    res.status(500).json({ error: "Server error" })
  }
}
