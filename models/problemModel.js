const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemSchema = new Schema({
     title: {
        type: String,
        required : true,
        unique: true,
        trim: true
     },
     description : {
        type: String,
        required : true
     },
     category : {
        type : String,
        required: true
     },
     rank : {
        type : String,
        required: true
     },
     difficulty: {
        type : String,
        required : true,
        enum: [
         "Easy",
         "Medium",
         "Hard"
        ]
     },
     inputs: [{
      type: String
     }],
     outputs: [{
      type: String
     }],
     hiddenInputs: [{
      type: String
     }],
     hddenOutputs: [{
      type: String
     }],
     numberOfSolutions: {
      type: Number,
      default: 0
     },
     // Consider it to be easier for hard delete
     contests: {
      type: [Schema.Types.ObjectId],
      ref: 'Contest'
     },
     users: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
     }
});

const Problem = mongoose.model('Problem' , problemSchema);

module.exports = Problem