const express = require("express");
const questionController = require("../controllers/questionController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.getAllQuestions
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.createQuestion
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.updateQuestion
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.deleteQuestion
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.getQuestion
  );
module.exports = router;
