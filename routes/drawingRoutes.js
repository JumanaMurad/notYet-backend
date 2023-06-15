const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawingController');

// POST route for creating a drawing
router.post('/', drawingController.saveSketchData);

// GET route for retrieving sketch data
router.get('/sketchData', drawingController.getSketchData);

module.exports = router;
