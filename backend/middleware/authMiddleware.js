const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const { check, validationResult } = require("express-validator");
const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized, no token" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};

module.exports = protect;
