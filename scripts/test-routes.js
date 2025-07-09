// ✅ NEW: Script to test which routes are available
const axios = require("axios")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

const testRoutes = async () => {
  const apiUrl = process.env.VITE_API_BASE_URL

  console.log("🔍 Testing available routes on:", apiUrl)

  const routesToTest = ["/", "/test", "/create-admin", "/api/create-admin", "/debug/routes"]

  for (const route of routesToTest) {
    try {
      const response = await axios.get(`${apiUrl}${route}`)
      console.log(`✅ ${route}: ${response.status} - ${response.data.message || "OK"}`)
    } catch (error) {
      console.log(
        `❌ ${route}: ${error.response?.status || "ERROR"} - ${error.response?.data?.message || error.message}`,
      )
    }
  }
}

testRoutes()
