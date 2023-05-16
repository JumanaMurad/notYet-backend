const mongoose = require('mongoose');
const User = require('../models/userModel');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
   teamName: {
      type: String,
      trim : true,
      required: true
   },
   teamMembers :[{
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      role: {
         type: String,
         enum: ['member', 'team-leader'],
         default: 'member'
      }
   }],
   pendingRequests : [{
      type:[Schema.Types.ObjectId],
      ref : 'User'
   }],
}
);

/* Pre-save middleware
UserSchema.pre('save', function (next) {

   // Capitalize the first letter of each word in the title
   this.teamName = this.teamName.replace(/\b\w/g, (match) => match.toUpperCase());
   
   next();
 }); */

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;