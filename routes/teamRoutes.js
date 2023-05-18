const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require("../controllers/authController");
const teamReqController = require("../controllers/teamJoinRequestController");
const router = express.Router();



router
    .route('/')
    .get(authController.protect , teamController.getAllTeams)
    .post(authController.protect, teamController.createTeam)
    .patch(authController.protect, teamController.addTeamMember);

router.patch('/join-team',authController.protect ,teamController.joinTeam);

router.get('/getPendingRequests',authController.protect ,teamReqController.getPendingRequests);
    
router
    .route('/:id')
    .get(authController.protect,teamController.getTeam)
    .delete(authController.protect ,teamController.deleteTeam);


module.exports = router;