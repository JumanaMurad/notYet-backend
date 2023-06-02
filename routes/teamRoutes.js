const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    teamController.getAllTeams
  )
  .patch(authController.protect, teamController.addTeamMember);

router.patch("/join-team", authController.protect, teamController.joinTeam);
router.patch(
  "/edit-team-name/:id",
  authController.protect,
  authController.restrictTo("admin"),
  teamController.editTeamName
);
router.patch(
  "/accept-request/:id",
  authController.protect,
  teamController.acceptRequest
);
router.patch(
  "/reject-request/:id",
  authController.protect,
  teamController.rejectRequest
);
router.get(
  "/getPendingRequests",
  authController.protect,
  teamController.getPendingRequests
);
router
  .route("/:id")
  .get(authController.protect, teamController.getTeam)
  .post(authController.protect, teamController.createTeam)
  .delete(authController.protect, teamController.deleteTeam);

module.exports = router;
