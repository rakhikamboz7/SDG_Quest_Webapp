const mongoose = require("mongoose");
const Quiz = require("../models/Quiz"); // 👈 import your model
require("dotenv").config(); // if using .env file

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const quizzes = await Quiz.find();

    for (const quiz of quizzes) {
      let updated = false;

      quiz.questions.forEach((q) => {
        if (!q.explanation) {
          q.explanation = "Explanation coming soon.";
          updated = true;
        }
      });

      if (updated) {
        await quiz.save();
        console.log(`✅ Updated quiz: ${quiz.goalName}`);
      }
    }

    console.log("🎉 All done!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
