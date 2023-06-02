const express = require("express");
const quizController = require("../controllers/quizController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(quizController.getAllQuizes)
  .post(quizController.createQuiz);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .patch(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

router.patch(
  "/quizEvaluation",
  authController.protect,
  quizController.updateUserQuizEvaluation
);

module.exports = router;
