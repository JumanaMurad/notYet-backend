const Whiteboard = require('../models/whiteboardModel');
const { v4: uuidv4 } = require("uuid");

// Function to create a whiteboard session for a team
exports.createWhiteboardSession = async (req, res, teamId) => {
  try {

    // Generate a unique session ID
    const session = uuidv4();

    // Create a new Whiteboard document for the team
    const whiteboard = new Whiteboard({
      team: teamId,
      session: session
    });

    // Save the whiteboard session to the database
    await whiteboard.save();

    // res.json({ session });
    return session
  } catch (error) {
    console.error('Error creating whiteboard session:', error);
    res.sendStatus(500);
  }
};

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


