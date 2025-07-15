const mongoose = require("mongoose");
const Quiz = require("../models/Quiz"); // Tera model path

mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addExplanations() {
  try {
    const result = await Quiz.updateMany(
      {}, // all documents
      {
        $set: {
          "questions.$[].explanation": "Explanation coming soon...",
        },
      }
    );
    console.log("Update success:", result);
  } catch (err) {
    console.error("Error updating:", err);
  } finally {
    mongoose.connection.close();
  }
}

addExplanations();
