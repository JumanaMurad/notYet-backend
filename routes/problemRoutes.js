const express = require("express");
const problemsController = require("../controllers/problemController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(problemsController.getAllProblems)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    problemsController.createProblem
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    problemsController.updateProblem
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    problemsController.deleteProblem
  )
  .get(authController.protect, problemsController.getProblem);

// router.get(
//   "/getSolvedProblems",
//   authController.protect,
//   problemsController.getSolvedProblems
// );

router.patch(
  "/submitproblem/:id",
  authController.protect,
  problemsController.submitProblem
);

module.exports = router;
