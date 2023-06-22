const Contest = require('../models/contestModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const Problem = require('../models/problemModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const whiteboardController = require('./whiteboardController');
const Whiteboard = require('../models/whiteboardModel');
const { v4: uuidv4 } = require("uuid");


exports.getAllContests = catchAsync(async (req, res) => {

  // EXECUTE A QUERY
  const features = new APIFeatures(Contest.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contests = await features.query;

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

  // Generate a unique session ID
  const sessionId = uuidv4();

  // Update the existing Whiteboard document for the team
  const whiteboard = new Whiteboard({users: [user._id], session: sessionId });
  await whiteboard.save();

  // Add the user to the contest's users list and individual standing list
  contest.users.push({
    userId: user._id,
    numberOfSolvedProblems: 0,
  });

  // Add the user to the contest's individual standing list
  contest.individualStanding.push(user._id);

  // Add the user to the contest's contestants list
  contest.contestants.push({
    userId: user._id,
    sessionId: sessionId,
    teamId: null, // Since this is an individual registration, the teamId can be set to null
  });

  // Add the contest ID to the user's contest list (individual registration)
  user.contests.push({
    contestId: contestId,
    registerationType: 'individual', // Add the registration type
    sessionId: sessionId
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

  // Check if any of the team members are already registered as contestants for the contest
  const isMemberRegistered = await Contest.exists({
    _id: contestId,
    contestants: {
      $elemMatch: {
        userId: { $in: team.teamMembers.map((member) => member.user) },
      },
    },
  });

  if (isMemberRegistered) {
    return res.status(400).json({
      status: 'fail',
      message: 'One or more team members are already registered as contestants for the contest',
    });
  }

  // Create the whiteboard session and get the session ID

  // Generate a unique session ID
  const sessionId = uuidv4();

  // Update the existing Whiteboard document for the team
  const whiteboard = new Whiteboard({ team: team._id, session: sessionId });
  await whiteboard.save();

  // Add the team to the contest's teams list with the session ID
  const newTeamEntry = {
    teamId: team._id,
    numberOfSolvedProblems: 0,
    submittedProblems: [],
  };

  // Update the contest and return the updated document
  await Contest.findOneAndUpdate(
    { _id: contestId },
    { $push: { teams: newTeamEntry } }
  );

  // Add all team members to the contestants list with the teamId
  const newContestantEntries = team.teamMembers.map((member) => ({
    userId: member.user,
    sessionId: sessionId,
    teamId: team._id,
  }));

  await Contest.updateOne({ _id: contestId }, { $push: { contestants: { $each: newContestantEntries } } });

  // Add the contest ID to the contests list for each team member
  for (const member of team.teamMembers) {
    const memberUserId = member.user;
    await User.findByIdAndUpdate(
      memberUserId,
      {
        $push: {
          contests: {
            contestId: contestId,
            registerationType: 'team',
            sessionId: sessionId,
          },
        },
      },
      { new: true }
    );
  }

  // Add the team ID to the teamStanding list
  await Contest.updateOne({ _id: contestId }, { $push: { teamStanding: team._id } });

  // Fetch the updated contest document
  const updatedContest = await Contest.findById(contestId);

  res.status(201).json({
    status: 'success',
    data: {
      contest: updatedContest,
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


// Function to remove team ID from contests
exports.removeTeamFromContests = catchAsync(async (teamId) => {
  // Update the contests that have the team ID in the teams list
  await Contest.updateMany(
    { 'teams.teamId': teamId },
    { $pull: { 'teams': { teamId: teamId } } }
  );

  // Update the teams that have the contest ID in the contests list
  await Contest.updateMany(
    { 'contestants.teamId': teamId },
    { $pull: { 'contestants': { teamId: teamId } } }
  );

  // Remove the team ID from the teamStanding list
  await Contest.updateMany(
    { 'teamStanding': teamId },
    { $pull: { 'teamStanding': teamId } }
  );
}
);


// Function to remove problem ID from contests
exports.removeProblemFromContests = catchAsync(async (problemId) => {
  await Contest.updateMany(
    { problems: problemId },
    { $pull: { problems: problemId } }
  );

  console.log(`Problem with ID ${problemId} removed from contests successfully.`);
  });
