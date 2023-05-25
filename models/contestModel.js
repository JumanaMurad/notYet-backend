const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    users: [{
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }],
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'Team'
    },
    problems: {
        type: [Schema.Types.ObjectId],
        ref: 'Problem'
    },
    indvidualStanding: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    teamStanding: {
        type: [Schema.Types.ObjectId],
        ref: 'Team'
    }
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
