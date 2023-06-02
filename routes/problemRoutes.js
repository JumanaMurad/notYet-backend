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

router.patch(
  "/submit-contest-problem/:id",
  authController.protect,
  problemsController.teamSubmitContestsProblem
);

//router.get('/get-names', authController.protect, problemsController.getProblemNames);

router.patch(
  "/user-submit-contest-problem/:id",
  authController.protect,
  problemsController.userSubmitContestProblem
);

//router.post('/submit', authController.protect, problemsController.submit);

module.exports = router;
