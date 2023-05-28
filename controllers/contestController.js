const Contest = require('../models/ContestModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync');

exports.getAllContests = catchAsync(async (req, res) => {
  //Filtering
       const queryObj = { ...req.query };
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
 
       const contests = await Contest.find(JSON.parse(queryStr));
 
       res.status(200).json({
         status: 'success',
         results: contests.length,
         data: {
           contests,
         },
       });
});


exports.getContest = catchAsync(async (req, res) => {
  const contest = await Contest.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
        contest,
    },
  });

});


exports.createContest = catchAsync( async (req, res) => {
  const newContest = await Contest.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newContest,
    },
  });
}
);


exports.updateContest = catchAsync(async (req, res) => {
  const contest = await Contest.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: {
        contest,
    },
  });
}
);
  

exports.deleteContest = catchAsync(async (req, res) => {
  await Contest.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    date: null,
  });
}
);


exports.registerUserForContest = catchAsync(async (req, res) => {
  const { username } = req.body;
  const contestId = req.params.id;

  // Find the contest
  const contest = await Contest.findById(contestId);

  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found'
    });
  }

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found'
    });
  }

  // Check if the user ID already exists in the contest's users list
  if (contest.users.includes(user._id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'User is already registered for the contest'
    });
  }

  // Add the user's ID to the users list in the contest
  contest.users.push(user._id);
  await contest.save();

  res.status(201).json({
    status: 'success',
    data: {
      contest
    }
  });
});


exports.registerTeamForContest = catchAsync(async (req, res) => {
  const { teamName } = req.body;
  const contestId = req.params.id;

  // Find the contest
  const contest = await Contest.findById(contestId);

  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found'
    });
  }

  // Find the team by its name
  const team = await Team.findOne({ teamName });

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found'
    });
  }

  // Check if the team ID already exists in the contest's teams list
  if (contest.teams.includes(team._id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Team is already registered for the contest'
    });
  }

  // Add the team's ID to the teams list in the contest
  contest.teams.push(team._id);
  await contest.save();

  res.status(201).json({
    status: 'success',
    data: {
      contest
    }
  });
});

exports.submitContestsProblem = catchAsync(async (req,res) => {
  const { contestId, teamName , status } = req.body;
  const contest = await Contest.findById(contestId);
  const team = await contest.teams.findOne(team => team.teamName === teamName);
  const problemId = req.params.problemId ; 
  const user = req.user;

  if(!problem){
    return res.status(404).json({ message: 'problem not found' });
  }
  
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  const isProblemSubmitted = team.submittedProblems.includes(problemId);

  if(team.teamMembers.includes(user.userId) && status === 'Accepted' && !isProblemSubmitted){
    team.numberOfSolvedProblems ++;
    team.submittedProblems.push(problemId);
    res.status(200).json({ message: 'Problem submitted successfully' });
  }

  await team.save();


});
