const express = require('express');

const router = express.Router();

const problemsController = require('../controllers/problems');

router.get('/',problemsController.getProblems);

//router.get('/add-problem',problemsController.getAddProblem);

router.post('/add-problem',problemsController.postAddProblem);

//router.delete('/delete-problem',problemsController.postDeleteProblem);

module.exports = router;