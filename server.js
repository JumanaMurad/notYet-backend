const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { v4: uuidv4 } = require("uuid");
const drawingController = require("./controllers/drawingController");


// Connect to the MongoDB database
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected successfully");
    // Start the server
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(
        `App running on port ${port}...`
      );
    });
    // Setup WebSocket
    const io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
    });
    
    
    // Handle socket connections

    io.on("connection", (socket) => {
      console.log("A user connected.");
    
      socket.on("canvas-data", (data) => {
        // Handle canvas data
        // Broadcast the data to all connected clients
        socket.broadcast.emit("canvas-data", data);
      });
    
      socket.on("reset-board", () => {
        // Handle reset board event
        // Broadcast the event to all connected clients
        socket.broadcast.emit("reset-board");
      });
    
      socket.on("disconnect", () => {
        console.log("A user disconnected.");
      });
    });
  })
  .catch(err => console.log(err));

