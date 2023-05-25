const Contest = require('../models/ContestModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllContests = catchAsync(async (req, res) => {
  //Filtering
       const queryObj = { ...req.query };
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
 
       const contests = await Contest.find(JSON.parse(queryStr));
 
       res.status(200).json({
         status: 'success',
         results: contests.length,
         data: {
           contests,
         },
       });
   });

exports.getContest = catchAsync(async (req, res) => {
  const contest = await Contest.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
        contest,
    },
  });

});

exports.createContest = catchAsync( async (req, res) => {
  const newContest = await Contest.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newContest,
    },
  });
}
);

exports.updateContest = catchAsync(async (req, res) => {
  const contest = await Contest.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: {
        contest,
    },
  });
}
);
  
exports.deleteContest = catchAsync(async (req, res) => {
  await Contest.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    date: null,
  });
}
);

<<<<<<< HEAD

=======
exports.registerToContest = catchAsync(async (req,res)=> {
  const { username, contestId } = req.body;
  const contest = await Contest.findById(contestId);
  
  if (!contest) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contest not found',
    });
  }
  const user = await User.findOne({ username });
  console.log(user);
  
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  if (contest.users.includes(user._id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'User already registered to the contest',
    });
  }

  contest.users.push(user._id);
  await contest.save();

  res.status(200).json({
    status: 'success',
    data: {
        contest,
    },
  });
});
>>>>>>> e45466ccd2978d2af38922f77521fff56f782f42
  