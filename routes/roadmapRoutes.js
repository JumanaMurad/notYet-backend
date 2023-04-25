const express = require('express');
const roadmapController = require('../controllers/roadmapController');
const authController = require('../controllers/authController');
const router = express.Router();

router
    .route('/')
    .get(authController.protect , roadmapController.getAllRoadmaps)
    .post(authController.protect , authController.restrictTo('admin'), roadmapController.createRoadmap);

router
    .route('/:id')
    .get(authController.protect , roadmapController.getRoadmap)
    .patch(authController.protect, authController.restrictTo('admin'), roadmapController.updateRoadmap)
    .delete(authController.protect, authController.restrictTo('admin'), roadmapController.deleteRoadmap);

module.exports = router;
