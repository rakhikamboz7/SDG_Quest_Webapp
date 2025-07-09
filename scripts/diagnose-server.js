// ✅ NEW: Comprehensive server diagnosis
const axios = require("axios")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

const diagnoseServer = async () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  console.log("🔍 Diagnosing server at:", apiUrl)
  console.log("=".repeat(50))

  // Test 1: Basic server health
  try {
    const response = await axios.get(apiUrl)
    console.log("✅ Server is running:", response.data)
  } catch (error) {
    console.log("❌ Server not responding:", error.message)
    return
  }

  // Test 2: Check existing routes that should work
  const testRoutes = [
    { method: "GET", path: "/test", description: "User routes test" },
    { method: "POST", path: "/login", description: "Login endpoint" },
    { method: "POST", path: "/register", description: "Register endpoint" },
    { method: "POST", path: "/create-admin", description: "Create admin endpoint" },
    { method: "POST", path: "/api/create-admin", description: "API create admin endpoint" },
    { method: "GET", path: "/api/quizzes", description: "Quizzes endpoint" },
  ]

  for (const route of testRoutes) {
    try {
      let response
      if (route.method === "GET") {
        response = await axios.get(`${apiUrl}${route.path}`)
      } else {
        // For POST routes, send minimal data to avoid validation errors
        response = await axios.post(`${apiUrl}${route.path}`, {})
      }
      console.log(`✅ ${route.method} ${route.path}: Available (${response.status})`)
    } catch (error) {
      const status = error.response?.status || "ERROR"
      const message = error.response?.data?.error || error.response?.data?.message || error.message

      if (status === 404) {
        console.log(`❌ ${route.method} ${route.path}: Not Found (404)`)
      } else if (status === 400) {
        console.log(`✅ ${route.method} ${route.path}: Available but needs data (400)`)
      } else {
        console.log(`⚠️  ${route.method} ${route.path}: ${status} - ${message}`)
      }
    }
  }

  console.log("\n🔧 Recommendations:")
  console.log("1. Check if your server has the latest userRoutes.js deployed")
  console.log("2. Verify the create-admin route is properly registered")
  console.log("3. Check server logs for any startup errors")
}

diagnoseServer()
