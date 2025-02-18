const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file ? req.file.path : null,
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });
    // console.log("dfghjkhghfdffghhjnndfghbnm",user)
    res.json({ token: generateToken(user._id), userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    res.json({
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid or missing token" });
  }
};
