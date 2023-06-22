const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const whiteboardSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  session: {
    type: String,
    unique: true,
    required: true
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  drawings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Drawing'
    }
]
});

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

module.exports = Whiteboard;
