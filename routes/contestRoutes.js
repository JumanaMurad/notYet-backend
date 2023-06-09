const express = require('express');
const contestController = require('../controllers/contestController');
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route('/')
    .get(contestController.getAllContests)
    .post(authController.protect ,contestController.createContest);
    
    
    router
    .route('/:id')
    .get(authController.protect , contestController.getContest)
    .patch(authController.protect , authController.restrictTo("admin"), contestController.updateContest)
    .delete(authController.protect , authController.restrictTo("admin"), contestController.deleteContest);
    
    
    router.patch('/register-team-contest/:id', authController.protect, contestController.registerTeamForContest);

router.patch('/register-contest/:id', authController.protect, contestController.registerUserForContest);

router.patch('/team-standing/:id', authController.protect ,contestController.teamStanding);

router.patch('/individual-standing/:id', authController.protect ,contestController.individualStanding);


/* router
    .route('/')
    .get(contestController.getAllFeedbacks)
    .post(contestController.createFeedback); */

module.exports = router;
