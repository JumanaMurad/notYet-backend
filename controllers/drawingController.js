const Drawing = require('../models/drawingModel');

// Function to save sketch data to the database
function saveSketchData(data) {
  // Create a new Drawing document with the provided data
  const drawing = new Drawing({
    data: data
  });

  // Save the drawing to the database
  drawing.save()
    .then(() => {
      console.log('Sketch data saved successfully');
    })
    .catch((error) => {
      console.error('Error saving sketch data:', error);
    });
}

// Function to retrieve sketch data from the database
async function getSketchData(drawingId) {
    try {
        // Retrieve the latest drawing from the database by sorting by creation date in descending order (-1)
        const sketchData = await Drawing.findOne().sort({ createdAt: -1 });
        return sketchData;
      } catch (error) {
        console.error('Error fetching sketch data:', error);
        throw error;
      }
}

module.exports = {
  saveSketchData,
  getSketchData
};
