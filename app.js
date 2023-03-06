const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const contentRoute = require('./routes/content');
const teamRoute = require('./routes/team');
const userRoute = require('./routes/users');
const User = require('./models/users');

app.use(express.static(path.join(__dirname, "js")));
app.use(express.json());

app.use('/accountsOverview',userRoute);
app.use('/editcontent',contentRoute);
app.use('/editteams', teamRoute);

mongoose.connect('mongodb+srv://rabehmohamed82:147258@project0.557hxjm.mongodb.net/project?retryWrites=true&w=majority')
.then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
            name : "rabeh",
            email : "rabehmohamed82@gmail.com",
            rank : 1,
            streak : 15,
            education : "bsc of cs",
            jobTitle : "Software Eng" 
         });   
         user.save();
        }
    })
    
    app.listen(3000);})
.catch(err => {console.log(err);})
;