// User model
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", UserSchema)
