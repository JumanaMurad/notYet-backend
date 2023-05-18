const Course = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllCourses = catchAsync(async (req, res) => {
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
}
);

exports.getCourse = catchAsync( async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
}
);

exports.createCourse = catchAsync(async (req, res) => {
  const newCourse = await Course.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newCourse,
    },
  });
}
);

exports.updateCourse = catchAsync(async (req, res) => {
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
}
);

exports.deleteCourse = catchAsync(async (req, res) => {
  await Course.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    date: null,
  });
}
);
