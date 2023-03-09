const Problem = require('../models/problemModel');

exports.getAllProblems = async (req,res) => {
    try{
        const problems = await Problem.find();
    
        res.status(200).json({
            status: 'sucess',
            results: problems.length,
            data: problems,
        });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err,    
              });
        }
}

exports.getProblem = async (req, res) => {
    try{
    const problem = await Problem.findById(req.params.id);

    res.status(200).json({
        status: 'sucess',
        data: {
          tour: problem,
        },
    });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,    
          });
    }
}

exports.createProblem = async (req, res) => {
    try{
    const newProblem = await Problem.create(req.body);

    res.status(201).json({
        status: 'sucess',
        data:newProblem,
      });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,    
          });
    }
}
exports.updateProblem = async (req, res) => {
    try{
    const newProblem = await Problem.findByIdAndUpdate(
        {_id: req.params.id},
        req.body);

    res.status(200).json({
        status: 'sucess',
        data: {
          tour: newProblem,
        },
      });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,    
        });
    }
}

exports.deleteProblem = async (req,res) => {
    try {
    await Problem.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',  
            data : null
          });
    } catch (err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
    
    
}
