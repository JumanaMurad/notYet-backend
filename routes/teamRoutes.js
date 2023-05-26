const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require("../controllers/authController");
const router = express.Router();



router
    .route('/')
    .get(authController.protect , teamController.getAllTeams)
    .patch(authController.protect, teamController.addTeamMember);

router.patch('/join-team',authController.protect ,teamController.joinTeam);
    
router
    .route('/:id')
    .get(authController.protect,teamController.getTeam)
    .post(authController.protect, teamController.createTeam)
    .delete(authController.protect ,teamController.deleteTeam);


module.exports = router;
