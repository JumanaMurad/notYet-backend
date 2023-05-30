const Problem = require('../models/problemModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Contest = require('../models/contestModel');

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


// exports.submitProblem = catchAsync(async (req, res) => {
//   const { status, username } = req.body;
//   const problemId = req.params.id;

//   try {
//     const problem = await Problem.findById(problemId);
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.submittedProblems.push({
//       problem: problemId,
//       status: status || 'Pending',
//     });

//     if (status === 'Accepted') {
//       if (!isNaN(problem.numberOfSolutions)) {
//         problem.numberOfSolutions = parseInt(problem.numberOfSolutions) + 1;
//         console.log(problem.numberOfSolutions);
//       } else {
//         problem.numberOfSolutions = 1;
//       }
//       await problem.save();
//     }

//     await User.updateOne({ username }, user);

//     res.status(200).json({ message: 'Problem submitted successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
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
      problem: problem.title, // Store problem title instead of ID
      status: status || 'Pending',
    });

    if (status === 'Accepted') {
      if (!isNaN(problem.numberOfSolutions)) {
        problem.numberOfSolutions = parseInt(problem.numberOfSolutions) + 1;
      } else {
        problem.numberOfSolutions = 1;
      }
    }

    await User.updateOne({ username }, user);
    await Problem.updateOne({ _id: problemId }, problem);

    res.status(200).json({ message: 'Problem submitted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

exports.teamSubmitContestsProblem = catchAsync(async (req, res) => {
  const { contestId, teamName, status } = req.body;
  const submittedProblem = await Problem.findById(req.params.id); // Retrieve problem ID from req.params

  // Find the contest object
  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: 'Contest not found' });
  }

  // Find the team object within the list of teams included in the contest
  const team = contest.teams.find((teamObj) => teamObj.teamName === teamName);
  console.log(team);
  if (!team) {
    return res.status(404).json({ message: 'Team not found in contest' });
  }

  // Find the problem based on the title in the contest
  const problem = contest.problems.find((problem) => problem.toLowerCase() === submittedProblem.title.toLowerCase());
  if (!problem) {
    return res.status(404).json({ message: 'Problem not found in contest' });
  }

  // Check if the user is a member of the team and the status is 'Accepted'
  if (status === 'Accepted') {
    // Increment the number of solved problems in the team
    if (!isNaN(team.numberOfSolvedProblems)) {
      team.numberOfSolvedProblems = parseInt(team.numberOfSolvedProblems) + 1;
    } else {
      team.numberOfSolvedProblems = 1;
    }

    console.log('Previous numberOfSolvedProblems:', team.numberOfSolvedProblems);

    // Initialize submittedProblems array if undefined in the team object
    if (!team.submittedProblems) {
      team.submittedProblems = [];
    }

    team.submittedProblems.push(submittedProblem.title); // Push the problem's title to the team's submittedProblems array

    console.log('Updated numberOfSolvedProblems:', team.numberOfSolvedProblems);

    // Update the team's solved problems count and submitted problems array within the contest object
    await Contest.updateOne(
      { _id: contest._id, 'teams.teamName': teamName },
      {
        $inc: { 'teams.$.numberOfSolvedProblems': 1 },
        $push: { 'teams.$.submittedProblems': submittedProblem.title }, // Push the problem's title to the team's submittedProblems array
      }
    );

    res.status(200).json({ message: 'Problem submitted successfully' });
  } else {
    res.status(400).json({ message: 'Invalid submission' });
  }
});

exports.userSubmitContestProblem = catchAsync (async (req,res) => {
  const { status, contestId } = req.body;
  const problemId = req.params.id;

  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: 'Contest not found' });
  }

  const user = contest.users.find((obj) => obj.userName === req.user.username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const problem = await Problem.findById(problemId);

  
  if (!problem || !contest.problems.includes(problemId)) {
    return res.status(404).json({ message: 'problem not found' });
}



  if (status === 'Accepted') {
    // Increment the number of solved problems in the team
    if (!isNaN(user.numberOfSolvedProblems)) {
      user.numberOfSolvedProblems = parseInt(user.numberOfSolvedProblems) + 1;
    } else {
      user.numberOfSolvedProblems = 1;
  } }

  await contest.save();

  res.status(201).json({
    status: 'success',
    data: 
      contest  
  });

});


 //team.teamMembers.includes(user.username) &&    
