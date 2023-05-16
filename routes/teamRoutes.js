const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require("../controllers/authController");
const teamReqController = require("../controllers/teamJoinRequestController");
const router = express.Router();



router
    .route('/')
    .get(authController.protect , teamController.getAllTeams)
    .post(authController.protect, teamController.createTeam);

router.post('/sendRequestToJoin',authController.protect , authController.restrictTo("user"),teamReqController.requestToJoin);

router.get('/getPendingRequests',authController.protect ,teamReqController.getPendingRequests);
    
router
    .route('/:id')
    .patch(authController.protect,teamController.updateTeam)
    .get(authController.protect,teamController.getTeam)
    .delete(authController.protect ,teamController.DeleteTeam)
    .post(authController.protect , authController.restrictTo("team-leader"),teamReqController.approveRequestToJoin)
    .post(authController.protect , authController.restrictTo("team-leader"),teamReqController.rejectRequestToJoin);


module.exports = router;