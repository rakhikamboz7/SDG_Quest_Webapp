// Admin middleware to protect admin-only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ error: "Access denied. Admin privileges required." })
  }
}

module.exports = adminOnly
