const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { type } = require('os');
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
   fullName: {
      type: String,
      required : true,
      trim: true
 },
   username: {
        type: String,
        required : true,
        unique: true,
        trim:true
   },
   email : {
      type: String,
      required : [true,'provide your email'],
      unique : true,
      lowercase : true,
      validate:[validator.isEmail , 'please, provide a valid email ']
   },
   role : {
      type : String,
      enum : ['user','admin','team-leader'],
      default : 'user'
   },
   password : {
         type:String,
         required : [true, 'provide a password'],
         minlength : 8,
         select : false
   },
   passwordConfirm : {
      type:String,
      required : [true, 'provide confirm your password'],
      validate : {
         // only works on create and save
         validator : function(passwordConfirm){
            return passwordConfirm === this.password;
         },
         message:'passwords do not match',
      }
   },
   passwordChangedAt : Date,
   passwordResetToken : String,
   passwordResetExpires : Date,
   emailVerified: {
      type: Boolean,
      default: false,
    },
   emailVerificationToken : String,
   quizId : {
      type: Schema.Types.ObjectId,
      ref : 'Quiz'
   },
   submittedProblems :[{
      problem: {
         type: String,
         ref: 'Problem',
         required: true
      },
      status: {
         type: String,
         enum: ['Pending', 'Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded'],
         default: 'Pending'
      }
   }],
   contest : {
      type: [Schema.Types.ObjectId],
      ref: 'Contest'
   },
   roadMap : {
      type: String
   },
   about:
   {
      type: String,
   },
   profilePic:
   {
      type: String
   },
   joinedTeams: [{
      type: String,
      ref: 'Team'
   }],
   pendingTeams: [{
      type: String,
      ref: 'Team'
   }]
   }  
);

//presave middleware runs between getting data and saving it to database
UserSchema.pre('save',async function(next){

   if(!this.isModified('password')) return next(); // runs if password was modified
   
   this.password = await bcrypt.hash(this.password , 10);  

   this.passwordConfirm = undefined;


});

UserSchema.pre('save', function(next){
   if(!this.isModified('password') || this.isNew) return next();
   this.passwordChangedAt = Date.now() - 1000;
   next();
})

//this points to current query
UserSchema.pre(/^find/ ,function(next){
   this.find({active : { $ne:false}});
   next();
})

UserSchema.methods.correctPassword = async function(candidatePassword,userPassword){
   return await bcrypt.compare(candidatePassword,userPassword);
}

UserSchema.methods.changePasswordAfter = async function(JWTTimestamp){
   if(this.passwordChangedAt){
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
      //console.log(changedTimestamp , JWTTimestamp);
      return JWTTimestamp < changedTimestamp;
   }
   //False means not changed 
   return false;
}

UserSchema.methods.createPasswordResetToken = function (){
   const resetToken = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log({resetToken},this.passwordResetToken);
   return resetToken;
}


// Pre-save middleware
UserSchema.pre('save', function (next) {

   // Make the username all in lowercase, then remove any white space
   this.username = this.username.toLowerCase().replace(/\s/g, '');

   // Capitalize the first letter of each word in the title
   this.fullName = this.fullName.replace(/\b\w/g, (match) => match.toUpperCase());
   
   next();
 });

const User = mongoose.model('User' , UserSchema);

module.exports = User;