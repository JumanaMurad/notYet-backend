const express = require('express');
const contestController = requie('../controllers/contestController');
const router = express.Router();

router
    .route('/')
    .get(contestController.getAllFeedbacks)
    .post(contestController.createFeedback);

router
    .route('/:id')
    .get(contestController.getFeedback)
    .patch(contestController.updateFeedback)
    .delete(contestController.deleteFeedback);

module.exports = router;
