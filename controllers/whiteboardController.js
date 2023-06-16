const Whiteboard = require('../models/whiteboardModel');
const Drawing = require('../models/drawingModel');
const catchAsync = require('../utils/catchAsync');


// Function to retrieve sketch data from the database
exports.getSketchData = catchAsync(async (req, res) => {
  const sessionId = req.params.sessionId;

  // Find the whiteboard session
  const whiteboard = await Whiteboard.findOne({ session: sessionId });

  if (!whiteboard) {
    return res.status(404).json({ message: 'Whiteboard session not found' });
  }

  // Retrieve the list of drawing IDs from the whiteboard
  const drawingIds = whiteboard.drawings;

  // Check if there are any drawing IDs in the list
  if (drawingIds.length === 0) {
    return res.status(404).json({ message: 'No drawings found for the whiteboard' });
  }

  // Retrieve the latest drawing from the list of drawing IDs
  const lastDrawingId = drawingIds[drawingIds.length - 1];

  const sketchData = await Drawing.findById(lastDrawingId);

  if (!sketchData) {
    return res.status(404).json({ message: 'No sketch data found for the whiteboard' });
  }
  
  res.status(200).json({
    status: 'success',
    drawing: {
      sketchData
    }
  });
});

// Function to get a whiteboard by session ID
exports.getWhiteboard = catchAsync(async (req, res) => {
  const sessionId = req.params.sessionId;

  // Find the whiteboard by session ID
  const whiteboard = await Whiteboard.findOne({ session: sessionId });

  if (!whiteboard) {
    return res.status(404).json({ message: 'Whiteboard not found' });
  }

  return res.status(200).json({
    status: 'success',
    whiteboard: {
      whiteboard
    }
  });
});

// Function to delete a whiteboard by session ID
exports.deleteWhiteboard = catchAsync(async (req, res) => {
  const sessionId = req.params.sessionId;

  // Find the whiteboard by session ID
  const whiteboard = await Whiteboard.findOne({ session: sessionId });

  if (!whiteboard) {
    return res.status(404).json({ message: 'Whiteboard not found' });
  }

  // Get the drawing IDs associated with the whiteboard
  const drawingIds = whiteboard.drawings;

  // Delete all the associated drawings
  await Drawing.deleteMany({ _id: { $in: drawingIds } });

  // Delete the whiteboard
  await whiteboard.remove();

  return res.status(200).json({
    status: 'success',
    message: 'Whiteboard and associated drawings deleted'
  });
});
