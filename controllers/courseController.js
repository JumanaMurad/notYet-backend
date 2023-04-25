const Course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
  try {

    //Filtering
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const courses = await Course.find(JSON.parse(queryStr));

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: 'success',
      date: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
}
