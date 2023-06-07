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

exports.createContest = catchAsync(async (req, res) => {
  const { name, startTime, endTime, problems } = req.body;

  // Check if the problems' IDs exist
  const existingProblems = await Problem.find({ _id: { $in: problems } });

  // Check if all the problems' IDs were found
  if (existingProblems.length !== problems.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more problems do not exist',
    });
  }

  // Create the contest
  const newContest = await Contest.create({
    name,
    startTime,
    endTime,
    problems,
  });

  // Update the contest ID in the contest list of each problem
  await Problem.updateMany(
    { _id: { $in: problems } },
    { $push: { contests: newContest._id } }
  );

  res.status(201).json({
    status: 'success',
    data: {
      contest: newContest,
    },
  });
});


exports.updateContest = catchAsync(async (req, res) => {
  // Find the contest by its ID
  const contest = await Contest.findById(req.params.id);

  // If the contest is not found, return a failure response
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found',
    });
  }

  // Update the contest with new data from req.body
  contest.set(req.body);

  // Save the updated contest to the database
  await contest.save();

  // Send a success response with the updated contest data
  res.status(200).json({
    status: 'success',
    data: {
      contest,
    },
  });
});


exports.deleteContest = catchAsync(async (req, res) => {
  // Find the contest by its ID and remove it
  const contest = await Contest.findByIdAndRemove(req.params.id);

  // If the contest is not found, return a failure response
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found',
    });
  }

  // Send a success response with null data (since the contest is deleted)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});


exports.registerUserForContest = catchAsync(async (req, res) => {
  const user = req.user;
  const contestId = req.params.id;

  // Find the contest
  const contest = await Contest.findById(contestId);

  // Check if the contest exists
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found',
    });
  }

  // Check if the user exists
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  // Check if the user is already registered for the contest based on the contest ID being present in the user's contest list
  const isUserRegistered = user.contests.some((entry) => entry.contestId && entry.contestId.equals(contestId));
  if (isUserRegistered) {
    return res.status(400).json({
      status: 'fail',
      message: 'User is already registered for the contest',
    });
  }

  // Add the user to the contest's users list and individual standing list
  contest.users.push({
    userId: user._id,
    numberOfSolvedProblems: 0,
  });

  // Add the contest ID to the user's contest list (individual registration)
  user.contests.push({
    contestId: contestId,
    registerationType: 'individual', // Add the registration type
  });

  // Update the contest and user data
  await Contest.updateOne({ _id: contestId }, contest);
  await User.updateOne({ _id: user._id }, user);

  res.status(201).json({
    status: 'success',
    data: {
      contest,
    },
  });
});




// Needs to be tested
exports.registerTeamForContest = catchAsync(async (req, res) => {
  const teamName = req.body.teamName;
  const contestId = req.params.id;

  // Find the contest
  const contest = await Contest.findById(contestId);

  // Check if the contest exists
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found',
    });
  }

  // Find the team by its name
  const team = await Team.findOne({ teamName });

  // Check if the team exists
  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found',
    });
  }

  // Check if the team is already registered for the contest
  const isTeamRegistered = contest.teams.some((entry) => entry.teamId && entry.teamId.equals(team._id));
  if (isTeamRegistered) {
    return res.status(400).json({
      status: 'fail',
      message: 'Team is already registered for the contest',
    });
  }

  // Check if any of the team members are individually registered for the contest
  const isMemberRegistered = await User.exists({
    contests: {
      $elemMatch: {
        contestId: contestId,
        registrationType: 'individual',
        userId: { $in: team.teamMembers.map((member) => member.user) },
      },
    },
  });
  if (isMemberRegistered) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more team members are already individually registered for the contest',
    });
  }

  // Add the team to the contest's teams list
  contest.teams.push({
    teamId: team._id,
    sessionId: team.sessionId,
    numberOfSolvedProblems: 0,
    submittedProblems: [],
  });

  // Add the team ID to the teamStanding list
  contest.teamStanding.push(team._id);

  // Update the contest
  await Contest.updateOne({ _id: contest._id }, contest);

  // Update the contest ID and registration type for each team member
  for (const member of team.teamMembers) {
    const memberUserId = member.user;
    await User.findByIdAndUpdate(
      memberUserId,
      {
        $push: {
          'contests': {
            contestId: contestId,
            registerationType: 'team',
          },
        },
      }
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      contest,
    },
  });
});



exports.teamStanding = catchAsync(async (req, res) => {

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

});


exports.individualStanding = catchAsync(async (req, res) => {
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
