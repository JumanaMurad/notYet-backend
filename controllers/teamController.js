const Team = require("../models/teamModel");
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllTeams = catchAsync(async (req, res) => {
  const teams = await Team.find();
  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  });
}
);

exports.getTeam = catchAsync( async (req, res) => {
  const team = await Team.findOne({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      team,

    },
  });
}
);

exports.createTeam = catchAsync(async (req, res) => {
  const { teamName, teamMembers } = req.body;
  const userId = req.params.id;

  // Create an array to store the team members
  const teamLeader = [];
  const pendingMembers = [];

  // Add the team leader (current user) to the team members array
  teamLeader.push({ user: userId, role: 'team-leader' });

  // Loop over the teamMembers array and extract the user IDs
  if (teamMembers && Array.isArray(teamMembers)) {
    for (const member of teamMembers) {
      const username = member.user;
      pendingMembers.push({ user: username, role: 'member' });
    }
  }

  // Create the new team
  const newTeam = await Team.create({
    teamName,
    teamMembers: teamLeader,
    pendingMembers
  });

  // Add team name to the joinedTeams array for the team leader
  const user = await User.findByIdAndUpdate(userId, {
    $push: { joinedTeams: newTeam.teamName }
  });

  // Add team name to the pendingTeams array for each team member
  for (const member of teamMembers) {
    const username = member.user;
    await User.findOneAndUpdate({ username }, {
      $push: { pendingTeams: newTeam.teamName }
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      newTeam
    }
  });
});


exports.addTeamMember = catchAsync(async (req, res) => {
  const { teamName, username } = req.body;

  // Find the team by teamName
  const team = await Team.findOne({ teamName });

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found',
    });
  }

  // Check if the team has reached the maximum capacity
  if (team.teamMembers.length + team.pendingMembers.length >= 3) {
    return res.status(400).json({
      status: 'fail',
      message: 'Team is full. Cannot add more members',
    });
  }

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  // Check if the user is already a team member or pending member
  const isTeamMember = team.teamMembers.some(
    (member) => member.user.toString() === user._id.toString()
  );
  const isPendingMember = team.pendingMembers.some(
    (member) => member.user.toString() === user._id.toString()
  );

  if (isTeamMember || isPendingMember) {
    return res.status(400).json({
      status: 'fail',
      message: 'User is already a team member or pending member',
    });
  }

  // Add team name to the pendingTeams array for the user
  await User.findOneAndUpdate({ username }, {
    $push: { pendingTeams: team.teamName }
  });

  // Create a new team member object
  const newTeamMember = {
    user: user.username,
    role: 'member',
  };

  // Always add the team member pendingMembers
  team.pendingMembers.push(newTeamMember);

  await team.save();

  res.status(200).json({
    status: 'success',
    message: 'Team member added successfully',
    data: {
      team,
    },
  });
});


exports.joinTeam = catchAsync(async (req, res) => {
  const { teamName, username } = req.body;

  // Find the team by teamName
  const team = await Team.findOne({ teamName });

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found',
    });
  }

  // Check if the team has reached the maximum capacity
  if (team.teamMembers.length + team.pendingMembers.length >= 3) {
    return res.status(400).json({
      status: 'fail',
      message: 'Team is full. Cannot add more members',
    });
  }

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  // Check if the user is already a team member or pending member
  const isTeamMember = team.teamMembers.some(
    (member) => member.user.toString() === user._id.toString()
  );
  const isPendingMember = team.pendingMembers.some(
    (member) => member.user.toString() === user._id.toString()
  );

  if (isTeamMember || isPendingMember) {
    return res.status(400).json({
      status: 'fail',
      message: 'You are already a team member or pending member',
    });
  }

  // Create a new team member object
  const newTeamMember = {
    user: user.username,
    role: 'member',
  };

  // Always add the team member pendingMembers
  team.pendingMembers.push(newTeamMember);

  // Add team name to the pendingTeams array for the user
  await User.findOneAndUpdate({ username }, {
    $push: { pendingTeams: team.teamName }
  });

  await team.save();

  res.status(200).json({
    status: 'success',
    message: 'Request sent successfully',
    data: {
      team,
    },
  });
});


exports.deleteTeam = catchAsync(async (req, res) => {
  const teamId = req.params.id;

  // Find the team to be deleted
  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found'
    });
  }

  // Remove team name from joinedTeams array for all team members
  const updateUsers = await User.updateMany(
    { joinedTeams: team.teamName },
    { $pull: { joinedTeams: team.teamName } }
  );

  // Remove team name from pendingTeams array for all pending members
  const updatePendingUsers = await User.updateMany(
    { pendingTeams: team.teamName },
    { $pull: { pendingTeams: team.teamName } }
  );

  // Delete the team
  await team.remove();

  res.status(200).json({
    status: 'success',
    message: 'Team deleted successfully'
  });
});

exports.editTeamName = catchAsync(async (req, res) => {
  const teamId = req.params.id;
  const { teamName } = req.body;

  // Find the team by its ID
  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      status: 'fail',
      message: 'Team not found',
    });
  }

  // Update the team name
  team.teamName = teamName;
  await team.save();

  res.status(200).json({
    status: 'success',
    data: {
      team,
    },
  });
});



// exports.createPendingMembers = catchAsync(async (req, res) => {
//   const teamId = req.params.id;
//   const { usernames } = req.body;

//   const team = await Team.findById(teamId);
//   if (!team) {
//     return res.status(404).json({ message: 'Team not found' });
//   }

//   const pendingMembers = await User.find({ username: { $in: usernames } });
//   team.pendingMembers.push(...pendingMembers);
//   await team.save();

//   res.status(200).json({
//     status: 'success',
//     data: {
//       pendingMembers: team.pendingMembers,
//     },
//   });
// }
// );

