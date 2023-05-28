const User = require('../models/userModel');
const Problem = require('../models/problemModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el]=obj[el];
  });
  return newObj;
}

exports.getAllUsers = catchAsync(async (req,res) => {
  const users = await User.find()
  .exec()
  .then(users=>
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    })
    );       
}
);

exports.getUser = catchAsync(async (req, res) => {
  
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });

}
);

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
      status: 'success',
      data: newUser,    
    });
}
);

exports.updateUser = catchAsync(
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: {
        user
      },
    });
}
);

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    date: null,
  });

});

exports.updateMe = async (req,res) => {
  //1)if user entered his password in other field
  if(req.body.password || req.body.passwordConfirm)
  {
    throw error('u can not change password here ');
  } 
  //2)Filter unathorized to update fields 
  const filtered = filterObj(req.body,'name','email','jobTitle');
  //3)update user document  
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filtered,
    {new:true, 
     runValidators : true
    }); 
  res.status(200).json({
    status:'success',
    data:{
      user: updatedUser
  }
  });
}

exports.deleteMe = async (req,res) => {
  await User.findByIdAndUpdate(req.user.id , {active : false});
  res.status(204).json({
    status:'success',
    data : null
  });
}


exports.getUserProblemStatistics = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('submittedProblems.problem');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const submittedProblems = user.submittedProblems;
    const totalSubmitted = submittedProblems.length;

    let totalAccepted = 0;
    let difficultyStats = {
      Hard: { totalSubmitted: 0, totalAccepted: 0, solvedPercentage: 0 },
      Easy: { totalSubmitted: 0, totalAccepted: 0, solvedPercentage: 0 },
      Medium: { totalSubmitted: 0, totalAccepted: 0, solvedPercentage: 0 }
    };

    for (let i = 0; i < totalSubmitted; i++) {
      const problem = submittedProblems[i].problem;

      // Check if problem is null or undefined
      if (!problem) {
        continue;
      }

      if (submittedProblems[i].status === 'Accepted') {
        totalAccepted++;
        difficultyStats[problem.difficulty].totalAccepted++;
      }
      difficultyStats[problem.difficulty].totalSubmitted++;
    }

    for (const difficulty in difficultyStats) {
      const { totalSubmitted, totalAccepted } = difficultyStats[difficulty];
      const solvedPercentage = (totalAccepted / totalSubmitted) * 100 || 0;
      difficultyStats[difficulty].solvedPercentage = solvedPercentage;
    }

    res.status(200).json({
      totalSubmitted: totalSubmitted,
      totalAccepted: totalAccepted,
      solvedPercentage: (totalAccepted / totalSubmitted) * 100 || 0,
      difficultyStats: difficultyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
