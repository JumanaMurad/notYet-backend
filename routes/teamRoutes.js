const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");
const router = express.Router();

router
.route("/")
.get(
  authController.protect, teamController.getAllTeams)
  .patch(authController.protect, teamController.addTeamMember)
  .post(authController.protect, teamController.createTeam);
  
  router.patch("/join-team", authController.protect, teamController.joinTeam);
  router.patch("/edit-team-name/:id", authController.protect, teamController.editTeamName);
  
  //router.patch("/accept-request/:id", authController.protect, teamController.acceptTeamJoinRequest);
  
  //router.patch("/reject-request/:id", authController.protect, teamController.rejectTeamJoinRequest);
  router.get("/getPendingRequests", authController.protect, teamController.getPendingRequests);
  
  router.patch('/accept-team-request/:teamId/:userName', teamController.acceptTeamJoinRequest);
  router.patch('/reject-team-request/:teamId/:userName', teamController.rejectTeamJoinRequest);
  
  //router.patch('/leader-accept-team-request/:teamId', teamController.LearderAcceptRequest);
  //router.patch('/leader-reject-team-request/:teamId', teamController.LeaderRejectRequest);
  



// router.get('/enrolled-teams', authController.protect, authController.)

router
.route("/:id")
.get(authController.protect, teamController.getTeam)
.delete(authController.protect, teamController.deleteTeam);

module.exports = router;
