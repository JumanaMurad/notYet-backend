const Roadmap = require('../models/roadmapModel');

exports.getAllRoadmaps = async (req, res) => {
    try {
        //Filtering
        const queryObj = { ...req.query };
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        const roadmaps = await Roadmap.find(JSON.parse(queryStr));

        res.status(200).json({
            status: 'success',
            results: roadmaps.length,
            data: {
                roadmaps,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

exports.getRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                roadmap,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

exports.createRoadmap = async (req, res) => {
    try {
        const newRoadmap = await Roadmap.create(req.body);

        res.status(201).json({
            status: 'sucess',
            data: {
                tour: newRoadmap,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

exports.updateRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findByIdAndUpdate(
            { _id: req.params.id },
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: {
                roadmap,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

exports.deleteRoadmap = async (req, res) => {
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
