
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
        userId : {
            type: Schema.Types.ObjectId,
            ref: 'User' 
    },
        numberOfSolvedProblems : {
            type : Number,
            default: 0
           },
    }],
    teams: [{
        teamId : {
            type:  Schema.Types.ObjectId,
            ref: 'Team'
       }, 
       sessionId : {
        type : String
       },
       numberOfSolvedProblems : {
        type : Number,
        default: 0
       },
       solvedProblems : [{
        type: Schema.Types.ObjectId,
        ref: 'Problem'
       }]
    }],
    problems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    individualStanding: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    teamStanding: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }]
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
