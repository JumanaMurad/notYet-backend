const express = require('express');
const feedbackController = requie('../controllers/feedbackController');
const router = express.Router();

router
    .route('/')
    .get(feedbackController.getAllFeedbacks)
    .post(feedbackController.createFeedback);

router
    .route('/:id')
    .get(feedbackController.getFeedback)
    .patch(feedbackController.updateFeedback)
    .delete(feedbackController.deleteFeedback);

module.exports = router;
