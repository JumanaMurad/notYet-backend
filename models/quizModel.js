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
          question : 
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Question' 
          },
          solved :
          {
            type : Boolean,
            default : false
          }

        }
      ],
      
    }
  ]
});

const Quiz = new mongoose.model('Quiz', quizSchema);

module.exports = Quiz;