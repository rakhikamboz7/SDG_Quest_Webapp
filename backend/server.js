require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5005;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api", require("./routes/scoreRoutes"));


app.get("/", (req, res) => res.send("API is running..."));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

































































// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const Quiz = require("./models/Quiz");


// const app = express();
// const PORT = process.env.PORT || 5005;
// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// // Database Connection
// const connectDB = require("./db/connect");

// // User Schema and Model
// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   image: String,
// });

// const User = mongoose.model("User", UserSchema);



// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Multer Configuration for Image Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Hi, I am live");
// });

// // Register Endpoint
// app.post("/register", upload.single("image"), async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       image: req.file ? req.file.path : null,
//     });
//     await newUser.save();
//     res.json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Login Endpoint
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // User Data Endpoint
// app.get("/user", async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.json({
//       name: user.name,
//       email: user.email,
//       image: user.image,
//     });
//   } catch (err) {
//     res.status(401).json({ error: "Invalid or missing token" });
//   }
// });




// app.use("/api/quizzes", require("./routes/quizRoutes"));





// // Start Server
// const start = async () => {
//   try {
//     await connectDB(process.env.MONGODB_URL);
//     const PORT = process.env.PORT || 5005;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();
