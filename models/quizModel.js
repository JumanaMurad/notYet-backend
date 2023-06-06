const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Question",
  },
});

const Quiz = new mongoose.model("Quiz", quizSchema);
module.exports = Quiz;