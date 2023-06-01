const Quiz = require('../models/quizModel');
const Question = require('../models/questionModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllQuizes = catchAsync(
    async (req, res) => {
   
        const quizes = await Quiz.find();

        res.status(200).json({
            status: 'success',
            results: quizes.length,
            data: {
                quizes
            }
        });
    
}
);

exports.getQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByID(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

/* exports.createQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                quiz
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
} */
exports.updateQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByIDAndUpdate(
            {_id: req.params.id},
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteQuiz = async (req, res) => {
    try{
        await Quiz.findByIDAndRemove(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createQuiz = catchAsync(async (req,res)=> {
    const easyQuestions = await Question.aggregate([{ $match: { difficulty: 'easy' } }, { $sample: { size: 2 } }]);
    const easyQuestionIds = easyQuestions.map((question) => question._id);
    
    const mediumQuestions = await Question.aggregate([{ $match: { difficulty: 'medium' } }, { $sample: { size: 2 } }]);
    const mediumQuestionIds = mediumQuestions.map((question) => question._id);

    const hardQuestions = await Question.aggregate([{ $match: { difficulty: 'hard' } }, { $sample: { size: 2 } }]);
    const hardQuestionIds = hardQuestions.map((question) => question._id);

    if(!easyQuestions || !mediumQuestions || !hardQuestions){
        return res.status(400).json({
            status: 'fail',
            message: 'error in generating questions'
          });
    }
    
    const quiz = new Quiz({
        questions: [
          {
            difficulty: 'easy',
            questionIds: easyQuestionIds
          },
          {
            difficulty: 'medium',
            questionIds: mediumQuestionIds
          },
          {
            difficulty: 'hard',
            questionIds: hardQuestionIds
          }
        ]
      });
      await quiz.save();

      res.status(201).json({
        status: 'success',
        data: quiz
      });


    });