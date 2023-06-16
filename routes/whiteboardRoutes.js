const express = require('express');
const whiteboardController = require('../controllers/whiteboardController');
const router = express.Router();

// Define the route for 5000/whiteboard
router.get('/:sessionId', whiteboardController.getSketchData);
router.get('/get-one/:sessionId', whiteboardController.getWhiteboard);
router.delete('/:sessionId', whiteboardController.deleteWhiteboard);

module.exports = router;
