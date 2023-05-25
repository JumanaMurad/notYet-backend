const Problem = require('../models/problemModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');

exports.getAllProblems = catchAsync(async (req, res) => {

    // EXECUTE A QUERY
    const features = new APIFeatures(Problem.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const problems = await features.query;
    if (!problems) {
        return next(new AppError('not found', 404))
    }

    res.status(200).json({
        status: 'sucess',
        results: problems.length,
        data: problems,
    });
})


exports.getProblem = catchAsync(async (req, res, next) => {

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        return next(new AppError('not found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            problem,
        },
    });

});

exports.createProblem = catchAsync(async (req, res, next) => {

    const newProblem = await Problem.create(req.body);

    res.status(201).json({
        status: 'sucess',
        data: newProblem,
    });
}
);

exports.updateProblem = catchAsync(async (req, res) => {

    const newProblem = await Problem.findByIdAndUpdate(
        { _id: req.params.id },
        req.body);

    res.status(200).json({
        status: 'sucess',
        data: {
            tour: newProblem,
        },
    });
});


exports.deleteProblem = catchAsync(async (req, res) => {

    await Problem.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});


// exports.getSolvedProblems = catchAsync(async (req, res) => {
//     const user = req.user;
//     const solvedProblems = user.submittedProblems;
//     res.status(200).json({
//         status: 'sucess',
//         data: [
//             solvedProblems
//         ],
//     });

// });


exports.submitProblem = catchAsync(async (req, res) => {
    const { status, username } = req.body;
    const problemId = req.params.id;
  
    try {
      const problem = await Problem.findById(problemId);
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.submittedProblems.push({
        problem: problemId,
        status: status || 'Pending',
      });
  
      if (status === 'Accepted') {
        if (!isNaN(problem.numberOfSolutions)) {
          problem.numberOfSolutions = parseInt(problem.numberOfSolutions) + 1;
          console.log(problem.numberOfSolutions);
        } else {
          problem.numberOfSolutions = 1;
        }
        await problem.save();
        console.log(problem);
      }
  
      await User.updateOne({ username }, user);
      console.log(user);
      console.log(problem);
  
      res.status(200).json({ message: 'Problem submitted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  
