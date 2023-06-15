const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const drawingSchema = new Schema({
  data: {
    type: String,
    required: true
  },
  whiteboard: {
    type: Schema.Types.ObjectId,
    ref: 'Whiteboard',
    required: true
  }
}, {
  timestamps: true
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;
