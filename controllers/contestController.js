const Contest = require('../models/ContestModel');

exports.getAllContests = async (req, res) => {
    try {

      //Filtering
      const queryObj = { ...req.query };
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      const Contests = await Contest.find(JSON.parse(queryStr));

      res.status(200).json({
        status: 'success',
        results: Contests.length,
        data: {
          Contests,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.getContest = async (req, res) => {
    try {
      const Contest = await Contest.findById(req.params.id);
  
      res.status(200).json({
        status: 'success',
        data: {
            Contest,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.createContest = async (req, res) => {
    try {
      const newContest = await Contest.create(req.body);
  
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newContest,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  };

exports.updateContest = async (req, res) => {
    try {
      const Contest = await Contest.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
  
      res.status(200).json({
        status: 'success',
        data: {
            Contest,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  };
  
exports.deleteContest = async (req, res) => {
    try {
      await Contest.findByIdAndRemove(req.params.id);
  
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
  