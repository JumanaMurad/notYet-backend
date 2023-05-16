const { ObjectID } = require("mongodb");
const { db } = require("../models/teamJoinRequestModel");
const Team = require("../models/teamModel");
const catchAsync = require('./../utils/catchAsync');

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
    const team = await Team.findOne({ _id: req.body.id });
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

exports.createTeam = catchAsync (async (req, res) => {
    const newTeam = await Team.create({
      teamName : req.body.teamName,
      teamMembers : [{user:req.user , role:'team-leader'}],
    });
   /* const user=req.user;
    newTeam.teamMembers.push(user); 
    newTeam.teamMembers[0].role = "team-leader";  
    //console.log(user);
    Team.updateOne(
      _{id:ObjectId(newTeam._id)}
    ) */
    
    res.status(201).json({
      status: "success",
      data: {
        newTeam,
      },
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
