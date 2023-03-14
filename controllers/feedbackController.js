const Feedback = require('../models/feedbackModel');

exports.getAllFeedbacks = async (req, res) => {
    try {

      //Filtering
      const queryObj = { ...req.query };
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      const feedbacks = await Feedback.find(JSON.parse(queryStr));

      res.status(200).json({
        status: 'success',
        results: feedbacks.length,
        data: {
          feedbacks,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.getFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
  
      res.status(200).json({
        status: 'success',
        data: {
            feedback,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.createFeedback = async (req, res) => {
    try {
      const newFeedback = await Feedback.create(req.body);
  
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newFeedback,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.updateFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
  
      res.status(200).json({
        status: 'success',
        data: {
            feedback,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  };
  
exports.deleteFeedback = async (req, res) => {
    try {
      await Feedback.findByIdAndRemove(req.params.id);
  
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
  };