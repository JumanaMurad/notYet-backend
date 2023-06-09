const express = require("express");
const Whiteboard = require("../models/whiteboardModel");
const catchAsync = require("../utils/catchAsync");

const MAX_USERS_PER_SESSION = 3;
let connectedUsers = {};

//function handles the socket.io connection events, including session validation, joining/leaving sessions, loading/saving drawing data, and emitting/receiving "canvas-data" events.
const handleConnection = (socket) => {
  const { sessionId } = socket.handshake.query;

  if (!sessionId || !isValidSession(sessionId)) {
    socket.emit("authentication_error", "Invalid session ID");
    socket.disconnect(true);
    return;
  }

  if (!connectedUsers[sessionId]) {
    connectedUsers[sessionId] = 0;
  }

  if (connectedUsers[sessionId] >= MAX_USERS_PER_SESSION) {
    socket.emit("authentication_error", "Session is full");
    socket.disconnect(true);
    return;
  }

  connectedUsers[sessionId]++;
  socket.join(sessionId);

  loadDrawingData(sessionId, (err, drawingData) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit("canvas-data", drawingData);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers[sessionId]--;
    socket.leave(sessionId);
  });

  socket.on("canvas-data", (data) => {
    io.to(sessionId).emit("canvas-data", data);

    saveDrawingData(sessionId, data, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};

exports.isValidSession = catchAsync((sessionId) => {
  console.log("Validating session ID:", sessionId);

  const isValid = typeof sessionId === "string" && sessionId.trim().length > 0;

  console.log("Session ID validation result:", isValid);

  return isValid;
});

exports.loadDrawingData = catchAsync((sessionId, callback) => {
  Whiteboard.findOne({ sessionId }, (err, drawing) => {
    if (err) {
      callback(err);
    } else if (drawing) {
      callback(null, drawing.data);
    } else {
      callback(null, null);
    }
  });
});

exports.saveDrawingData = catchAsync((sessionId, data, callback) => {
  Whiteboard.findOneAndUpdate(
    { sessionId },
    { sessionId, data },
    { upsert: true },
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    }
  );
});

exports.setIO = (socketIO) => {
  io = socketIO; // Set the io variable
};

exports.handleConnection = handleConnection;
