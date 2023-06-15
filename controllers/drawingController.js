const Drawing = require('../models/drawingModel');
const Whiteboard = require('../models/whiteboardModel');

// Function to save sketch data to the database
exports.saveSketchData = async (req, res) => {
  try {
    // Extract the sketch data from the request body
    const { teamId, session, data } = req.body;

    // Find the whiteboard session for the team
    const whiteboard = await Whiteboard.findOne({ team: teamId, session: session });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard session not found' });
    }

    // Create a new Drawing document with the provided data
    const drawing = new Drawing({
      data: data,
      whiteboard: whiteboard._id
    });

    // Save the drawing to the database
    await drawing.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving sketch data:', error);
    res.sendStatus(500);
  }
};

// Function to retrieve sketch data from the database
exports.getSketchData = async (req, res) => {
  try {
    const { teamId, session } = req.body;

    // Find the whiteboard session for the team
    const whiteboard = await Whiteboard.findOne({ team: teamId, session: session });

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard session not found' });
    }

    // Retrieve the latest drawing associated with the whiteboard from the database
    const sketchData = await Drawing.findOne({ whiteboard: whiteboard._id }).sort({ createdAt: -1 });

    if (!sketchData) {
      return res.status(404).json({ message: 'No sketch data found for the whiteboard' });
    }

    res.json(sketchData);
  } catch (error) {
    console.error('Error fetching sketch data:', error);
    res.sendStatus(500);
  }
};
