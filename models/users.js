const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    name: {
        type: String,
        required : true
     },
     email : {
      type: String,
      //required : true
     },
     rank : {
        type: Number, 
     },
     streak : {
        type : Number,
     },
     education : {
        type : String,
     },
     jobTitle: {
        type : String
     },
     examId : {
      type: Schema.Types.ObjectId,
     // ref : 'Exam'
     },
     problemsId : [{
      type: Schema.Types.ObjectId,
      ref : 'Problem'
     }]     
     }  
);

module.exports = mongoose.model('User' , UserSchema);