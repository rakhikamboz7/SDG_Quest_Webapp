const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." })
    }

    next()
  } catch (error) {
    console.error("Admin middleware error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

module.exports = adminOnly
