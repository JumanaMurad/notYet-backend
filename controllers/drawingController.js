const Drawing = require('../models/drawingModel');
const Whiteboard = require('../models/whiteboardModel');
const catchAsync = require('../utils/catchAsync');

// Function to save sketch data to the database
exports.saveSketchData = catchAsync(async (req, res) => {
  // Extract the sketch data from the request body
  const { sessionId, data } = req.body;

  // Find the whiteboard session
  const whiteboard = await Whiteboard.findOne({ session: sessionId });

  if (!whiteboard) {
    return res.status(404).json({ message: 'Whiteboard session not found' });
  }

  // Create a new Drawing document with the provided data and associate it with the whiteboard
  const drawing = await Drawing.create({
    data: data,
  });

   // Find and update the whiteboard document to include the drawing
   const updatedWhiteboard = await Whiteboard.findOneAndUpdate(
    { session: sessionId },
    { $push: { drawings: drawing._id } },
    { new: true }
  );
  

  return res.status(200).json({
    status: 'success',
    whiteboard: updatedWhiteboard
  });
});

// Function to get a drawing by ID
exports.getDrawing = catchAsync(async (req, res) => {
  // Extract the drawing ID from the request parameters
  const id = req.params.id;

  // Find the drawing by ID
  const drawing = await Drawing.findById(id);

  if (!drawing) {
    return res.status(404).json({ message: 'Drawing not found' });
  }

  return res.status(200).json({
    status: 'success',
    drawing: drawing
  });
});

