const path = require('path');
const express = require("express");
const morgan = require("morgan");

//const mongoose = require('mongoose');

const contentRouter = require("./routes/problemRoutes");
const teamRouter = require("./routes/teamRoutes");
const userRouter = require("./routes/userRoutes");
const courseRouter = require('./routes/courseRoutes');
const quizRouter = require('./routes/quizRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "js")));
app.use(express.json());

app.use((req,res,next)=>{
 // console.log(req.headers);
  next();
})

// ROUTES
app.use('/users', userRouter);
app.use('/problems', contentRouter);
app.use('/teams', teamRouter);
app.use('/courses', courseRouter);
app.use('/quizes', quizRouter);


module.exports = app;