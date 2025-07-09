// ✅ Alternative approach: Try multiple endpoints
const axios = require("axios")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

const createAdminAlternative = async () => {
  const adminSecret = process.env.ADMIN_CREATION_SECRET
  const apiUrl = process.env.VITE_API_BASE_URL 
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  console.log("🔐 Trying alternative admin creation methods...")

  // List of possible endpoints to try
  const endpoints = ["/create-admin", "/api/create-admin", "/admin/create", "/user/create-admin"]

  for (const endpoint of endpoints) {
    try {
      console.log(`🔄 Trying: ${apiUrl}${endpoint}`)

      const response = await axios.post(`${apiUrl}${endpoint}`, {
        adminSecret: adminSecret,
      })

      console.log(`✅ SUCCESS! Admin created via: ${endpoint}`)
      console.log("📧 Email:", adminEmail)
      console.log("🎯 You can now login through the regular login form")
      return // Exit on success
    } catch (error) {
      const status = error.response?.status
      if (status === 404) {
        console.log(`❌ ${endpoint}: Route not found`)
      } else if (status === 400 && error.response?.data?.error === "Admin user already exists") {
        console.log(`✅ ${endpoint}: Admin already exists!`)
        console.log("📧 Email:", adminEmail)
        return // Exit on success
      } else {
        console.log(`❌ ${endpoint}: ${status} - ${error.response?.data?.error || error.message}`)
      }
    }
  }

  console.log("\n❌ All endpoints failed. Your server might need to be updated with the admin routes.")
}

createAdminAlternative()
