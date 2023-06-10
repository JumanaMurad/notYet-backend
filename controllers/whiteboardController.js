const socketIO = require('socket.io');

let io; // Socket.IO server instance

exports.configureSocket = (app) => {
  const io = socketIO(app);

  io.on("connection", (socket) => {
    console.log("User Online");
  
    socket.on("canvas-data", (data) => {
      socket.broadcast.emit("canvas-data", data);
    });
  });
}

exports.getIO = () => {
    return io;
  };
  