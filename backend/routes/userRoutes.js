const express = require("express");
const { registerUser, loginUser, getUserData } = require("../controllers/userController");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUserData);


module.exports = router;
