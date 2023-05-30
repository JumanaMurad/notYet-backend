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
        userName : {
            type: String,
            ref: 'User' 
    },
        numberOfSolvedProblems : {
            type : Number,
            default: 0
           },
    }],
    teams: [{
        teamName : {
            type:  String,
            ref: 'Team'
       }, 
       sessionId : {
        type : String
       },
       numberOfSolvedProblems : {
        type : Number,
        default: 0
       },
       submittedProblems : [{
        type: String,
        ref: 'Problem'
       }]
    }],
    problems: [{
        type: String,
        ref: 'Problem'
    }],
    individualStanding: [{
        type: String,
        ref: 'User'
    }],
    teamStanding: [{
        type: String,
        ref: 'Team'
    }]
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
