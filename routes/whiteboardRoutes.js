const express = require('express');
const whiteboardController = require('../controllers/whiteboardController');
const router = express.Router();

// Define the route for 5000/whiteboard
router.get('/', (req, res) => {
    whiteboardController.configureSocket(req.app);
    res.sendStatus(200);
  });

module.exports = router;
