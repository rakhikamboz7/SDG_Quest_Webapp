// ✅ Manual admin creation using direct database connection
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

// Import your User model
const User = require("../backend/models/user")

const createAdminManually = async () => {
  try {
    console.log("🔐 Creating admin user directly in database...")

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("✅ Connected to MongoDB")

    const adminEmail = process.env.ADMIN_EMAIL 
    const adminPassword = process.env.ADMIN_PASSWORD 

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists")
      console.log("📧 Email:", adminEmail)
      console.log("🔑 Role:", existingAdmin.role)
      await mongoose.disconnect()
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create admin user
    const adminUser = new User({
      name: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    })

    await adminUser.save()

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🔑 Password:", adminPassword)
    console.log("🎯 You can now login through the regular login form")

    await mongoose.disconnect()
    console.log("✅ Database connection closed")
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message)
    await mongoose.disconnect()
  }
}

createAdminManually()
