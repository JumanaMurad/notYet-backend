const mongoose = require("mongoose");
  
const questionSchema = mongoose.Schema({
   question: {
    type: String,
    required: true
  },
  choices: [
    {
      type: String,
      required: true
    }
  ],
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  } 
});

const Question = new mongoose.model("Question", questionSchema);

module.exports = Question;
