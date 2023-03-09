const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require("../controllers/authController");
const router = express.Router();



router
    .route('/')
    .get(authController.protect , teamController.getAllTeams)
    .post(authController.protect, teamController.createTeam);

router
    .route('/:id')
    .patch(authController.protect,teamController.updateTeam)
    .get(authController.protect,teamController.getTeam)
    .delete(authController.protect ,teamController.DeleteTeam);


module.exports = router;