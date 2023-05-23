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
    
    
    router.patch('/register-contest/' ,authController.protect,contestController.registerToContest);


/* router
    .route('/')
    .get(contestController.getAllFeedbacks)
    .post(contestController.createFeedback); */

module.exports = router;
