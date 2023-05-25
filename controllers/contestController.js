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


  