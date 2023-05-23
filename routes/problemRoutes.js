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
<<<<<<< HEAD
    .route('/')    
    .get(problemsController.getAllProblems)
    .post(authController.protect , authController.restrictTo('admin') ,problemsController.createProblem);
=======
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    problemsController.updateProblem
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "team-leader"),
    problemsController.deleteProblem
  )
  .get(authController.protect, problemsController.getProblem);
>>>>>>> 2852eff05d990b5beb35af8050504639859ff8f8

router.get(
  "/getSolvedProblems",
  authController.protect,
  problemsController.getSolvedProblems
);

module.exports = router;
