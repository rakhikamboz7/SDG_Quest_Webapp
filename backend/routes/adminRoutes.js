// In routes/admin.js or similar
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      lastLogin: new Date(),
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
  console.error("❌ Failed to create admin:", err.message || err);
  process.exit(1);
}
});

module.exports = router;
