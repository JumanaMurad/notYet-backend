const express = require('express');
const whiteboardController = require('../controllers/whiteboardController');
const router = express.Router();

// Define the route for 5000/whiteboard
router.get('/:sessionId', whiteboardController.getSketchData);

module.exports = router;
