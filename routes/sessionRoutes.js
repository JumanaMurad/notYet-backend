const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const sessionController = require("../controllers/sessionController");

router.get("/createSession", (req, res) => {
  const sessionId = uuidv4();
  console.log(`New session created with ID: ${sessionId}`);
  //res.send(sessionId);
  res.json({
    status: "success",
    sessionId: sessionId,
  });
});

router.get("/", (req, res) => {
  const sessionKey = req.query.sessionKey;
  if (!sessionKey) {
    res.sendFile(path.join(__dirname, "../utils/index.html"));
  } else {
    res.redirect(`http://localhost:8000?sessionKey=${sessionKey}`);
  }
});

module.exports = router;
