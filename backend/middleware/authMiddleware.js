const jwt = require("jsonwebtoken")
const User = require("../models/user")

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "Rakhi")

      const user = await User.findById(decoded.id).select("-password")
      if (!user) {
        return res.status(401).json({ error: "User not found" })
      }

      if (user.isActive === false) {
        return res.status(401).json({ error: "Account is deactivated" })
      }

      req.user = user
      next()
    } catch (error) {
      console.error("Auth middleware error:", error)
      return res.status(401).json({ error: "Not authorized, token failed" })
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token" })
  }
}

module.exports = protect
