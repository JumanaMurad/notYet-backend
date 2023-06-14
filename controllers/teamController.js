const Team = require("../models/teamModel");
const User = require("../models/userModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("../utils/email");



exports.getAllTeams = catchAsync(async (req, res) => {
  // EXECUTE A QUERY
  const features = new APIFeatures(Team.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const teams = await features.query;
  
  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  });
});

exports.getTeam = catchAsync(async (req, res) => {
  const team = await Team.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});


exports.createTeam = catchAsync(async (req, res) => {
  const { teamName, teamMembers } = req.body;
  const userId = req.user._id;

  // Create an array to store the team leader
  const teamLeader = [{ user: userId, role: "team-leader" }];

  // Create an array to store the pending members
  const pendingMembers = [];

  // Loop over the teamMembers array and find each member by their username
  if (teamMembers && Array.isArray(teamMembers)) {
    for (const member of teamMembers) {
      // Find the user by their username
      const user = await User.findOne({ username: member.user });

      // If a user is found, add their ID to the pendingMembers array with the role set to "member"
      if (user) {
        pendingMembers.push({ user: user._id, role: "member" });
      }
    }
  }

  // Create the new team with the provided teamName, teamMembers (containing the team leader), and pendingMembers
  const newTeam = await Team.create({
    teamName,
    teamMembers: teamLeader,
    pendingMembers,
  });

  // Add the team ID to the joinedTeams array for the team leader
  await User.findByIdAndUpdate(userId, {
    $push: { joinedTeams: newTeam._id },
  });

  // Loop over the teamMembers array again to find each member by their username
  for (const member of teamMembers) {
    // Find the user by their username
    const user = await User.findOne({ username: member.user });

    // If a user is found, add the team ID to their pendingTeams array
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $push: { pendingTeams: newTeam._id },
      });
    }
  }

  // Respond with a success status and the newTeam object
  res.status(201).json({
    status: "success",
    data: {
      newTeam,
    },
  });
});


exports.addTeamMember = catchAsync(async (req, res) => {
  const { teamName, username } = req.body;

  // Find the team by teamName
  const team = await Team.findOne({ teamName });

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  // Check if the team has reached the maximum capacity
  if (team.teamMembers.length + team.pendingMembers.length >= 3) {
    return res.status(400).json({
      status: "fail",
      message: "Team is full. Cannot add more members",
    });
  }

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
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
      status: "fail",
      message: "User is already a team member or pending member",
    });
  }

  // Add team name to the pendingTeams array for the user
  await User.findOneAndUpdate(
    { username },
    {
      $push: { pendingTeams: team._id },
    }
  );

  const acceptUrl = `http://localhost:3000/accept-team-request/${team._id}/${user.username}`;
  const rejectUrl = `http://localhost:3000/reject-team-request/${team._id}/${user.username}`;


  await sendEmail({
    email: user.email,
    subject: `NOT YET ! TEAM INVITATION.`,
    message: `Hello ${user.username},
     You're invtied to join : ${team.teamName}.
    Do you want to accept or reject this request?
    Click ${acceptUrl} if YES
    OR
    Click ${rejectUrl} if NO 

    `,
  });

  // Create a new team member object
  const newTeamMember = {
    user: user._id,
    role: "member",
  };

  // Always add the team member pendingMembers
  team.pendingMembers.push(newTeamMember);

  await team.save();

  res.status(200).json({
    status: "success",
    message: "Team member added successfully",
    data: {
      team,
    },
  });
});

exports.joinTeam = catchAsync(async (req, res) => {
  const teamName = req.body.teamName;
  const user = req.user;
  const userId = req.user._id;

  // Find the team by teamName
  const team = await Team.findOne({ teamName: teamName });

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  // Check if the team has reached the maximum capacity
  if (team.teamMembers.length + team.pendingMembers.length >= 3) {
    return res.status(400).json({
      status: "fail",
      message: "Team is full. Cannot add more members",
    });
  }

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // Check if the user is already a team member or pending member
  const isTeamMember = team.teamMembers.some(
    (member) => member.user.toString() === userId.toString()
  );
  const isPendingMember = team.pendingMembers.some(
    (member) => member.user.toString() === userId.toString()
  );

  if (isTeamMember || isPendingMember) {
    return res.status(400).json({
      status: "fail",
      message: "You are already a team member or pending member",
    });
  }

  // Create a new team member object
  const newTeamMember = {
    user: userId,
    role: "member",
  };

  // Add the team member to the pendingMembers array
  team.pendingMembers.push(newTeamMember);

  // Add the team ID to the user's pendingTeams array
  await User.findByIdAndUpdate(
    userId,
    {
      $push: { pendingTeams: team._id },
    }
  );

  await team.save();

  res.status(200).json({
    status: "success",
    message: "Request sent successfully",
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
      status: "fail",
      message: "Team not found",
    });
  }

  // Delete the team
  await team.remove();

  res.status(200).json({
    status: "success",
    message: "Team deleted successfully",
  });
});

exports.editTeamName = catchAsync(async (req, res) => {
  const teamId = req.params.id;
  const { teamName } = req.body;

  // Find the team by its ID
  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  // Update the team name
  team.teamName = teamName;
  await team.save();

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

exports.acceptTeamJoinRequest = catchAsync(async (req, res) => {
  const { teamId, userName } = req.params;

  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  const user = await User.findOne({ username: userName });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // Check if the user is a pending member of the team
  const pendingMemberIndex = team.pendingMembers.findIndex(member =>
    member.user.equals(user._id) && member.role === 'member'
  );

  if (pendingMemberIndex === -1) {
    return res.status(400).json({
      status: "fail",
      message: "User is not a pending member of the team",
    });
  }

  // Remove the user from the pendingMembers list
  team.pendingMembers.splice(pendingMemberIndex, 1);

  // Remove the team's ID from the pendingTeams list of the user
  const pendingTeamIndex = user.pendingTeams.findIndex(teamId =>
    teamId.toString() === team._id.toString()
  );

  if (pendingTeamIndex !== -1) {
    user.pendingTeams.splice(pendingTeamIndex, 1);
  }

  // Add the user to the teamMembers list of the team
  team.teamMembers.push({ user: user._id, role: "member" });

  // Add the team's ID to the joinedTeams list of the user
  user.joinedTeams.push(team._id);

  // Update the team and user models using the update function
  await Team.updateOne(
    { _id: team._id },
    { $set: { pendingMembers: team.pendingMembers, teamMembers: team.teamMembers } }
  );

  await User.updateOne(
    { _id: user._id },
    { $set: { pendingTeams: user.pendingTeams, joinedTeams: user.joinedTeams } }
  );

  res.status(200).json({
    status: "success",
    message: "Request accepted successfully",
    data: {
      team,
    },
  });
});

exports.rejectTeamJoinRequest = catchAsync(async (req, res) => {
  const { teamId, userName } = req.params;

  const team = await Team.findById(teamId);

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }
  const user = await User.findOne({ username: userName });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // Check if the user is a pending member of the team
  const pendingMember = team.pendingMembers.find(member => member.user.equals(user._id) && member.role === 'member');

  if (!pendingMember) {
    return res.status(400).json({
      status: "fail",
      message: "User is not a pending member of the team",
    });
  }

  // Remove the user from the pendingMembers list
  team.pendingMembers.pull(pendingMember);

  // Remove the team's ID from the pendingTeams list of the user
  user.pendingTeams = user.pendingTeams.filter(teamId => teamId.toString() !== team._id.toString());

  // Update the team and user models using the update function
  await Team.findByIdAndUpdate({ _id: team._id }, { $set: { pendingMembers: team.pendingMembers } });
  await User.findByIdAndUpdate({ _id: user._id }, { $set: { pendingTeams: user.pendingTeams } });

  res.status(200).json({
    status: "success",
    message: "Request rejected successfully",
    data: {
      team,
    },
  });
});

exports.LearderAcceptRequest = catchAsync (async(req,res)=>{
  const teamId = req.params.teamId;
  const { userId } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  const pendingMemberIndex = team.pendingMembers.findIndex(member =>
    member.user.equals(user._id) && member.role === 'member'
  );

  if (pendingMemberIndex === -1) {
    return res.status(400).json({
      status: "fail",
      message: "User is not a pending member of the team",
    });
  }

  // Remove the user from the pendingMembers list
  team.pendingMembers.splice(pendingMemberIndex, 1);

  // Remove the team's ID from the pendingTeams list of the user
  const pendingTeamIndex = user.pendingTeams.findIndex(teamId =>
    teamId.toString() === team._id.toString()
  );

  if (pendingTeamIndex !== -1) {
    user.pendingTeams.splice(pendingTeamIndex, 1);
  }

  // Add the user to the teamMembers list of the team
  team.teamMembers.push({ user: user._id, role: "member" });

  // Add the team's ID to the joinedTeams list of the user
  user.joinedTeams.push(team._id);

  // Update the team and user models using the update function
  await Team.updateOne(
    { _id: team._id },
    { $set: { pendingMembers: team.pendingMembers, teamMembers: team.teamMembers } }
  );

  await User.updateOne(
    { _id: user._id },
    { $set: { pendingTeams: user.pendingTeams, joinedTeams: user.joinedTeams } }
  );

  res.status(200).json({
    status: "success",
    message: "Request accepted successfully",
    data: {
      team,
    },
  });


})

exports.LeaderRejectRequest = catchAsync (async (req,res)=>{
  const teamId = req.params.teamId;
  const { userId } = req.body;
  
  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // Check if the user is a pending member of the team
  const pendingMember = team.pendingMembers.find(member => member.user.equals(user._id) && member.role === 'member');

  if (!pendingMember) {
    return res.status(400).json({
      status: "fail",
      message: "User is not a pending member of the team",
    });
  }

  // Remove the user from the pendingMembers list
  team.pendingMembers.pull(pendingMember);

  // Remove the team's ID from the pendingTeams list of the user
  user.pendingTeams = user.pendingTeams.filter(teamId => teamId.toString() !== team._id.toString());

  // Update the team and user models using the update function
  await Team.findByIdAndUpdate({ _id: team._id }, { $set: { pendingMembers: team.pendingMembers } });
  await User.findByIdAndUpdate({ _id: user._id }, { $set: { pendingTeams: user.pendingTeams } });

  res.status(200).json({
    status: "success",
    message: "Request rejected successfully",
    data: {
      team,
    },
  });

});


exports.getPendingRequests = catchAsync(async (req, res) => {
  const { teamName } = req.body;
  const team = await Team.findOne({ teamName });
  if (!team) {
    return res.status(404).json({
      message: "Team not found",
    });
  }
  const pendingMembers = team.pendingMembers;
  res.status(200).json({
    status: "success",
    data: { pendingMembers },
  });
});
