const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
  questions: [
    {
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      },
      questionIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        }
      ]
    }
  ]
});

const Quiz = new mongoose.model('Quiz', quizSchema);

module.exports = Quiz;