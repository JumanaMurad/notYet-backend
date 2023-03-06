const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: {
        type: String,
        required : true
     },
     rank : {
        type: Number,
       
     },
     streak : {
        type : Number,

     },
     hint : {
        type : String,
     },
     teamLeader: {
        type : String,
        required : true
     }, 
     teamMembers : 
      [
         {
            type: Schema.Types.ObjectId,
            ref : 'User'    
         },
         {
            type: Schema.Types.ObjectId,
            ref : 'User'  
         },
         {
            type: Schema.Types.ObjectId,
            ref : 'User'  
         }
      ]
     }   
);


module.exports = mongoose.model('Team' , teamSchema);