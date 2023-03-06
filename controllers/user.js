const User = require('../models/users');

exports.getUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.status(201).json({
        status: 'success',
        data: users,
      });
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err
    })
}
}

exports.postUser = async (req, res) => {
    const name=req.body.name;
    const rank = req.body.rank;
    const streak = req.body.streak;
    const education = req.body.education; 
    const jobTitle = req.body.jobTitle;
    const examId = req.body.examId;
    const problemsId = req.body.problemsId;
    const newUser = await User.create({
        name:name,
        rank:rank,
        streak:streak,
        education:education,
        jobTitle:jobTitle,
        problemsId:problemsId,
        examId:examId
    });
    res.status(201).json({
        status: 'success',
        data: newUser,    
      });
}
