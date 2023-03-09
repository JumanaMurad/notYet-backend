const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const router = express.Router();

router
    .route('/')
    .get(authController.protect , courseController.getAllCourses)
    .post(authController.protect , authController.restrictTo('admin'), courseController.createCourse);

router
    .route('/:id')
    .get(authController.protect , courseController.getCourse)
    .patch(authController.protect , courseController.updateCourse)
    .delete(authController.protect , courseController.deleteCourse);

module.exports = router;
