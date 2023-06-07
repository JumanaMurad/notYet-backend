const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllQuizes = catchAsync(async (req, res) => {
  const quizes = await Quiz.find();

  res.status(200).json({
    status: "success",
    results: quizes.length,
    data: {
      quizes,
    },
  });
});

exports.getQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      quiz,
    },
  });
});

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
  try {
    const quiz = await Quiz.findByIDAndUpdate({ _id: req.params.id }, req.body);

    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIDAndRemove(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createQuiz = catchAsync(async (req, res) => {
  const {questionIds}  = req.body;

  const newQuiz = await Quiz();
    newQuiz.questions = questionIds; // Assign questionIds to the 'questions' field

    await newQuiz.save();


  res.status(201).json({
    status: "success",
    data: newQuiz,
  }); 

 /* const easyQuestions = await Question.aggregate([
    { $match: { difficulty: "easy" } },
    { $sample: { size: 2 } },
  ]);
  const easyQuestionIds = easyQuestions.map((question) => question._id);

  const mediumQuestions = await Question.aggregate([
    { $match: { difficulty: "medium" } },
    { $sample: { size: 2 } },
  ]);
  const mediumQuestionIds = mediumQuestions.map((question) => question._id);

  const hardQuestions = await Question.aggregate([
    { $match: { difficulty: "hard" } },
    { $sample: { size: 2 } },
  ]);
  const hardQuestionIds = hardQuestions.map((question) => question._id);

  if (!easyQuestions || !mediumQuestions || !hardQuestions) {
    return res.status(400).json({
      status: "fail",
      message: "Error in generating questions",
    });
  }

  const quiz = new Quiz({
    questions: [...easyQuestionIds, ...mediumQuestionIds, ...hardQuestionIds],
  });

  await quiz.save();

  res.status(201).json({
    status: "success",
    data: quiz,
  }); */
});

exports.updateUserQuizEvaluation = catchAsync(async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const quizEvaluation = req.body.quizEvaluation;
  user.quizEvaluation = quizEvaluation;

  //await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});