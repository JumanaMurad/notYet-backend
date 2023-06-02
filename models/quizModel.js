const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  questions: [
    {
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
      },
      questionIds: [
        {
<<<<<<< HEAD
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
=======
          question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
          },
          solved: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
>>>>>>> 2a9165c00e9db0262ec20f311c9b3a86bd2c75e6
});

const Quiz = new mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
