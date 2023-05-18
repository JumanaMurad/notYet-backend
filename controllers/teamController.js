const { ObjectID } = require("mongodb");
const { db } = require("../models/teamJoinRequestModel");
const Team = require("../models/teamModel");
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({
      status: "success",
      results: teams.length,
      data: {
        teams,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        team,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// exports.createTeam = catchAsync (async (req, res) => {
//     const newTeam = await Team.create({
//       teamName : req.body.teamName,
//       teamMembers : [{user:req.user , role:'team-leader'}],
//     });
    
//     res.status(201).json({
//       status: "success",
//       data: {
//         newTeam,
//       },
//     });
   
// });

exports.createTeam = catchAsync(async (req, res) => {
  const { teamName, teamMembers } = req.body;

  // Create an array to store the team members
  const teamLeader = [];
  const pendingMembers = [];

  // Add the team leader (current user) to the team members array
  teamLeader.push({ user: req.user.username, role: 'team-leader',  });

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

  res.status(201).json({
    status: 'success',
    data: {
      newTeam
    }
  });
});







exports.updateTeam = async (req, res) => {
  try {
    const newTeam = await Team.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    res.status(200).json({
      status: "success",
      data: {
        newTeam,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.DeleteTeam = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};


exports.createPendingMembers = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { usernames } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const pendingMembers = await User.find({ username: { $in: usernames } });
    team.pendingMembers.push(...pendingMembers);
    await team.save();

    res.status(200).json({
      status: 'success',
      data: {
        pendingMembers: team.pendingMembers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

