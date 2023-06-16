const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawingController');

// POST route for creating a drawing
router.post('/', drawingController.saveSketchData);

router.get('/:id', drawingController.getDrawing);

module.exports = router;
