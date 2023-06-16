const Whiteboard = require('../models/whiteboardModel');
const Drawing = require('../models/drawingModel');
const catchAsync = require('../utils/catchAsync');


// Function to update the whiteboard data for a team
exports.updateWhiteboardData = async (req, res) => {
  try {
    const { teamId, session, data } = req.body;

    // Find the whiteboard session for the team
    const whiteboard = await Whiteboard.findOne({ team: teamId, session: session });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard session not found' });
    }

    // Update the whiteboard data
    whiteboard.data = data;

    // Save the updated whiteboard session
    await whiteboard.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating whiteboard data:', error);
    res.sendStatus(500);
  }
};



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

  console.log(sketchData)
  res.json(sketchData);
});


