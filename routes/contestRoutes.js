const express = require('express');
const contestController = require('../controllers/contestController');
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route('/')
    .get(authController.protect ,contestController.getAllContests)
    .post(authController.protect ,contestController.createContest);

router
    .route('/:id')
    .get(authController.protect , contestController.getContest)
    .patch(authController.protect , authController.restrictTo("admin"), contestController.updateContest)
    .delete(authController.protect , authController.restrictTo("admin"), contestController.deleteContest);


/* router
    .route('/')
    .get(contestController.getAllFeedbacks)
    .post(contestController.createFeedback); */

module.exports = router;
