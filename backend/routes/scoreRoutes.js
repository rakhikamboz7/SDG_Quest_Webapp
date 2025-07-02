const express = require("express");
const { submitScore, getScores } = require("../controllers/scoreController");

const router = express.Router();

// Submit quiz score
router.post("/scores/submit", submitScore);

// Get all scores of a user
router.get("/scores/:userId", getScores);

module.exports = router;
