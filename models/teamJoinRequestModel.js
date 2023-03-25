const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const teamJoinRequestSchema = mongoose.Schema({
    user: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
});

const TeamJoinRequest = mongoose.model('TeamJoinRequest', teamJoinRequestSchema);

module.exports = TeamJoinRequest;