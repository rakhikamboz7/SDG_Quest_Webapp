const mongoose = require("mongoose");
const Score = require("../models/Score");
const User = require("../models/user");

exports.submitScore = async (req, res) => {
  console.log("📥 Request Body:", req.body);

  try {
    let { userId, quizId, score, goalId, totalQuestions } = req.body;

    // Basic validations
    if (!userId || !quizId || score === undefined || !totalQuestions || !goalId) {
      return res.status(400).json({ error: "All fields (userId, quizId, score, goalId, totalQuestions) are required" });
    }

    goalId = String(goalId).trim();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if score already exists for this quiz+goal+user
    let existingScore = await Score.findOne({ userId, quizId, goalId });

    if (existingScore) {
      existingScore.score = score;
      existingScore.totalQuestions = totalQuestions;
      await existingScore.save();
    } else {
      const newScore = new Score({
        userId,
        quizId,
        score,
        goalId,
        totalQuestions,
      });
      await newScore.save();
    }

    await user.save(); // If you are tracking user points or something

    res.json({
      message: existingScore ? "Score updated successfully" : "Score submitted successfully",
      score,
      goalId,
    });
  } catch (error) {
    console.error("❌ Error in submitScore:", error);
    res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
};

exports.getScores = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📤 Fetching scores for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const userScores = await Score.find({ userId });

    if (!userScores || userScores.length === 0) {
      return res.status(404).json({ message: "No scores found for this user" });
    }

    res.json({ userScores });
  } catch (error) {
    console.error("❌ Error fetching scores:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error.message });
  }
};
