const Quiz = require("../models/Quiz");

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getQuestionsByGoalId = async (req, res) => {
  // console.log("dfghjkl",req)
    try {
      const { goalId } = req.params; 
      // console.log("aaaaaaaaaa",goalId)// Get goalId from request params
      const quiz = await Quiz.findOne({ goalId: Number(goalId) }); // Find quiz with matching goalId
  
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
  
      res.json(quiz.questions); // Return only the questions
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  