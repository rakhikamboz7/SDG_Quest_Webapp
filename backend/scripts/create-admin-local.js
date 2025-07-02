// ✅ Alternative: Run this script from the backend directory
const axios = require("axios")
require("dotenv").config() // Will automatically load .env from current directory

const createAdmin = async () => {
  try {
    console.log("🔐 Setting up admin user securely...")

    const adminSecret = process.env.ADMIN_CREATION_SECRET
    const apiUrl = process.env.VITE_API_BASE_URL || "http://localhost:10000"
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log("🔍 Environment check:")
    console.log("  - API URL:", apiUrl)
    console.log("  - Admin Email:", adminEmail ? "✅ Found" : "❌ Missing")
    console.log("  - Admin Secret:", adminSecret ? "✅ Found" : "❌ Missing")
    console.log("  - Admin Password:", adminPassword ? "✅ Found" : "❌ Missing")

    if (!adminSecret || !adminEmail || !adminPassword) {
      console.error("❌ Missing environment variables in .env file")
      console.error("💡 Your .env file should contain:")
      console.error("   ADMIN_EMAIL=admin@sdgquest.com")
      console.error("   ADMIN_PASSWORD=admin123")
      console.error("   ADMIN_CREATION_SECRET=super-secret-admin-key-2024")
      return
    }

    console.log("🔄 Creating admin user...")

    const response = await axios.post(`${apiUrl}/api/create-admin`, {
      adminSecret: adminSecret,
    })

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🎯 You can now login through the regular login form")
  } catch (error) {
    if (error.response?.data?.error === "Admin user already exists") {
      console.log("ℹ️  Admin user already exists")
      console.log("📧 Email:", process.env.ADMIN_EMAIL)
    } else {
      console.error("❌ Failed to create admin:", error.response?.data?.error || error.message)

      if (error.code === "ECONNREFUSED") {
        console.error("💡 Make sure your backend server is running")
      }
    }
  }
}

createAdmin()
