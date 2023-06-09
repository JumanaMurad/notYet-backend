const mongoose = require("mongoose");
const { Schema } = mongoose;

const whiteboardSchema = new Schema({
  sessionId: String,
  data: String,
});

const Whiteboard = mongoose.model("whiteboard", whiteboardSchema);

module.exports = Whiteboard;
