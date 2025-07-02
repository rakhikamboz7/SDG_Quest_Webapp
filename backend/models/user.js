// UPDATE your existing User model to include the new fields
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ ADD THIS
  profilePicture: String,
  image: String, // Keep existing field
  isActive: { type: Boolean, default: true }, // ✅ ADD THIS
  lastLogin: Date, // ✅ ADD THIS
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", UserSchema)
