const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new mongoose.Schema({
    user: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    feedback: {
        type: String,
    },
    contest: {
        type: [Schema.Types.ObjectId],
        ref: 'Contest'
    }
});

const Contest = mongoose.model('Feedback', feedbackSchema);

module.exports = Contest;
