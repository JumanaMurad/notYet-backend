const Quiz = require('../models/quizModel');

exports.getAllQuizes = async (req, res) => {
    try{
        const quizes = await Quiz.find();

        res.status(200).json({
            status: 'success',
            results: quizes.length,
            data: {
                quizes
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByID(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                quiz
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByIDAndUpdate(
            {_id: req.params.id},
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteQuiz = async (req, res) => {
    try{
        await Quiz.findByIDAndRemove(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}