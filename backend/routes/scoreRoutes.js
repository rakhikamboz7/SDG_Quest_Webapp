const express = require("express");
const { submitScore , getScores} = require("../controllers/scoreController");

const router = express.Router();

router.post("/scores/submit", submitScore); // Route to submit a score
router.get("/scores/:userId",getScores);
module.exports = router;
