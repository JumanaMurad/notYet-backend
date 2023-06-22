const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const problemRouter = require("./routes/problemRoutes");
const teamRouter = require("./routes/teamRoutes");
const userRouter = require("./routes/userRoutes");

const quizRouter = require("./routes/quizRoutes");

const contestRouter = require("./routes/contestRoutes");
const roadmapRouter = require("./routes/roadmapRoutes");
const questionRouter = require("./routes/questionRoutes");

const drawingRoutes = require('./routes/drawingRoutes');
const whiteboardRoutes = require('./routes/whiteboardRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "js")));
app.use(express.json());

app.use(cors());

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

// ROUTES
app.use("/users", userRouter);
app.use("/problems", problemRouter);
app.use("/teams", teamRouter);

app.use("/quizes", quizRouter);

app.use("/contests", contestRouter);
app.use("/roadmaps", roadmapRouter);
app.use("/questions", questionRouter);

app.use('/drawing', drawingRoutes);
app.use('/whiteboard', whiteboardRoutes);


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
