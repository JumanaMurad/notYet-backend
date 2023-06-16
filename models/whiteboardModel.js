const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whiteboardSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  session: {
    type: String,
    required: true
  },
  drawings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drawing'
    }
]
});

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

module.exports = Whiteboard;
