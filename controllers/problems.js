const Problem = require('../models/problems');

exports.getProblems = async (req,res,next) => {
    const problems = await Problem.find();
    res.status(201).json({
        status: 'success',
        data: problems,
    
      });
}

exports.postAddProblem = async (req, res, next) => {
    const title=req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const hint = req.body.hint;
    const difficulty = req.body.difficulty; 
    const newProblem = await Problem.create({
         title:title,
         description:description,
         category:category
        ,hint:hint,
         difficulty:difficulty
    });
    res.status(201).json({
        status: 'success',
        data: newProblem,    
      });
    
}

exports.postDeleteProblem = async (req,res,next) => {
    try {
    await Problem.findByIdAndDelete(id);
        res.status(204).json({
            status: 'success',  
            data : null
          });
    }
    catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
    
    
}
