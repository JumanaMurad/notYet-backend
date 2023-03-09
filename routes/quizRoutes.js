const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

router
    .route('/')
    .get(quizController.getAllQuizes)
    .post(quizController.createQuiz);

router
    .route('/:id')
    .get(quizController.getQuiz)
    .patch(quizController.updateQuiz)
    .delete(quizController.deleteQuiz);

module.exports = router;