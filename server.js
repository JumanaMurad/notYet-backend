const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { v4: uuidv4 } = require("uuid");
//const Whiteboard = require("./models/whiteboardModel");
//const { handleConnection } = require("./controllers/sessionController");
const http = require("http");
const socketIO = require("socket.io");

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
  });

// Create the HTTP server
//const server = http.createServer(app);

// // Initialize Socket.IO
// const io = socketIO(server);
// io.on("connection", handleConnection);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `App running on port ${port}...`
  );
});