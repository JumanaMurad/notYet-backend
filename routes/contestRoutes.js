const express = require('express');
const contestController = require('../controllers/contestController');
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route('/')
    .get(authController.protect ,contestController.getAllContests)
    .get(authController.protect ,contestController.getContest);

router
    .route('/:id')
    .get(authController.protect , authController.restrictTo("admin"), contestController.createContest)
    .patch(authController.protect , authController.restrictTo("admin"), contestController.updateContest)
    .delete(authController.protect , authController.restrictTo("admin"), contestController.deleteContest);


/* router
    .route('/')
    .get(contestController.getAllFeedbacks)
    .post(contestController.createFeedback); */

module.exports = router;
