const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  goalId: { type: Number, required: true, unique: true },
  goalName: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
