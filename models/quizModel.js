const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    questions: {
        type: [String],
        required: true
    },
    answers: {
        type: [String],
        required: true
    },
    difficulty: {
        type: String
    },
    language: {
        type: String
    }
});

const Quiz = new mongoose.model('Quiz', quizSchema);

module.exports = Quiz;