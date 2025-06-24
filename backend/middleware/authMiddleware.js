const jwt = require("jsonwebtoken")
const User = require("../models/user")

const protect = async (req, res, next) => {
  let token

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token (excluding password)
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return res.status(401).json({ error: "User not found" })
      }

      if (!user.isActive) {
        return res.status(401).json({ error: "Account is deactivated" })
      }

      // Add user to request object
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }

      next()
    } catch (err) {
      console.error("Auth middleware error:", err)
      res.status(401).json({ error: "Not authorized, token failed" })
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" })
  }
}

module.exports = protect
