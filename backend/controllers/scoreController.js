const Score = require("../models/Score");
const User = require("../models/user");

exports.submitScore = async (req, res) => {
  console.log(req.body);
  try {
    let { userId, quizId, score, goalId, totalQuestions } = req.body;   //extracted required details to submit score

    // console.log("Goal ID Type:", typeof goalId, "Value:", goalId);

    if (!userId || !quizId || score === undefined || !totalQuestions || !goalId) {
      return res.status(400).json({ error: "All fields (including goalId) are required" });
    }

    // Ensure goalId is a valid string
    goalId = String(goalId).trim();
    if (!goalId) return res.status(400).json({ error: "goalId cannot be empty" });

    // Find an existing score entry for the same user, quiz, and goal
    let existingScore = await Score.findOne({ userId, quizId, goalId });
//find the user in the database 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (existingScore) {
      // Adjust reward points by subtracting the previous score's points
      // const previousPoints = existingScore.score * 10;
      // user.currentPoints -= previousPoints;

      // Update the existing score
      existingScore.score = score;
      existingScore.totalQuestions = totalQuestions;
      await existingScore.save();
    } else {
      // Create a new score entry
      const newScore = new Score({ userId, quizId, score, goalId, totalQuestions });
      await newScore.save();
    }

 
    await user.save();

    res.json({
      message: existingScore ? "Score updated successfully" : "Score submitted successfully",
      score,
      goalId,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getScores = async (req, res) => {
  try {
      const { userId } = req.params;
      console.log(userId)
      const userScores = await Score.find({ userId });
      console.log(userScores)
      if (!userScores || userScores.length === 0) {
          return res.status(404).json({ message: "No scores found for this user" });
      }

      // const totalScore = userScores.reduce((sum, score) => sum + score.score, 0);

      res.json({ userScores });
  } catch (error) {
      console.error("Error fetching user score:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

