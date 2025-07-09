require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()
const PORT = 10000

console.log("Starting server...")

connectDB()

// ✅ MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use("/uploads", express.static("uploads"))

// ✅ ROUTES - Make sure userRoutes is loaded first and properly
console.log("🔧 Loading routes...")

// Your original routes that were working
app.use("/", require("./routes/userRoutes")) // This should handle /create-admin
app.use("/api/quizzes", require("./routes/quizRoutes"))
app.use("/api", require("./routes/scoreRoutes"))

// ✅ Health check
app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    timestamp: new Date().toISOString(),
    routes: "Check /test for available routes",
  })
})

// ✅ Catch all for debugging
app.use("*", (req, res) => {
  console.log("Route not found:", req.method, req.originalUrl)
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    url: req.originalUrl,
    availableRoutes: ["GET /", "GET /test", "POST /login", "POST /register", "POST /create-admin"],
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Server URL: http://localhost:${PORT}`)
})
