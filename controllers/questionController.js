const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");

// Get all questions
exports.getAllQuestions = catchAsync(async (req, res) => {
  const questions = await Question.find();

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});

// Get a question by ID
exports.getQuestion = catchAsync(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    // If the question with the provided ID doesn't exist
    return res.status(404).json({
      status: "fail",
      message: "Question not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

// Create a new question
exports.createQuestion = catchAsync(async (req, res) => {
  const question = await Question.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

// Update a question by ID
exports.updateQuestion = catchAsync(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

// Delete a question by ID
exports.deleteQuestion = catchAsync(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Deleted Successfully"
  });
});
