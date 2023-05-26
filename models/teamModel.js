const mongoose = require('mongoose');
const User = require('../models/userModel');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
   teamName: {
      type: String,
      trim : true,
      unique: true,
      required: true
   },
   teamMembers :[{
      user: {
         type: String,
         ref: 'User',
         required: true
      },
      role: {
         type: String,
         enum: ['member', 'team-leader'],
         default: 'member',
         required: true
      }
   }],
   pendingMembers : [{
      user: {
         type: String,
         ref: 'User',
         required: true
      },
      role: {
         type: String,
         default: 'member',
         required: true
      }
   }],
   contests: {
      type: [Schema.Types.ObjectId],
      ref: 'Contest'
   },
   sessionId: {
      type: String
   }
}
);


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
