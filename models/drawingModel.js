// Drawing.js

const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;
