const Contest = require('../models/contestModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel')
const Problem = require('../models/problemModel')
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

  // Check if the user's username already exists in the contest's users list
  if (contest.users.includes(user.username)) {
    return res.status(400).json({
      status: 'fail',
      message: 'User is already registered for the contest'
    });
  }

  // Add the user's username to the users list and indvidual standing list in the contest
  contest.users.push(user.username);
  contest.indvidualStanding.push(user.username);

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

  // Check if the team name already exists in the contest's teams list
  if (contest.teams.some((entry) => entry.team === teamName)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Team is already registered for the contest'
    });
  }

  // Add the team's name to the teams list in the contest
  contest.teams.push({
    teamName: teamName,
    sessionId: team.sessionId,
    numberOfSolvedProblems: 0,
    submittedProblems: []
  });
  contest.teamStanding.push()

  await contest.save(team.teamName);

  res.status(201).json({
    status: 'success',
    data: {
      contest
    }
  });
});

exports.teamStanding = catchAsync(async (req,res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found'
    });
  }
  // Sort the teams based on numberOfSolvedProblems in descending order
  const sortedTeams = contest.teams.sort((a, b) => b.numberOfSolvedProblems - a.numberOfSolvedProblems);

  // Map the sorted teams to only include team names
  const rankedTeamNames = sortedTeams.map(team => team.teamName);

  // Update the teamStanding array with the ranked team names
  contest.teamStanding = rankedTeamNames;

  // Save the changes to the contest
  await contest.save();

  res.status(201).json({
    status: 'success',
    data: 
      contest.teamStanding
    
  });

})

exports.individualStanding = catchAsync (async (req,res) => {
  const contest = await Contest.findById(req.params.id).populate('users', 'userName numberOfSolvedProblems');;
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found'
    });
  }
  
  // Sort the teams based on numberOfSolvedProblems in descending order
  const sortedUsers = contest.users.sort((a, b) => b.numberOfSolvedProblems - a.numberOfSolvedProblems);
  // Map the sorted teams to only include team names
  const rankedUserNames = sortedUsers.map(user => user.userName);
  // Update the teamStanding array with the ranked team names
  contest.individualStanding = rankedUserNames;
  // Save the changes to the contest
  await contest.save();

  res.status(201).json({
    status: 'success',
    data: 
      contest.individualStanding
    
  });
//  console.log(contest.individualStanding);
});
