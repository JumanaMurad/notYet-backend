const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    unquie: true,
    trim: true,
    reuqired: true,
  },
  answers: [
    {
      type: String,
      reuqired: true,
      trim: true,
      enum: ["Wrong", "Correct"],
    },
  ],
  difficulty: {
    type: String,
    reuqired: true,
    trim: true,
    enum: ["easy", "medium", "hard"],
  },
});

const Question = new mongoose.model("Question", questionSchema);

module.exports = Question;
