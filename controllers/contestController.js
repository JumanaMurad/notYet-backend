const Contest = require('../models/ContestModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllContests = catchAsync(async (req, res) => {
  //Filtering
       const queryObj = { ...req.query };
       let queryStr = JSON.stringify(queryObj);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
 
       const Contests = await Contest.find(JSON.parse(queryStr));
 
       res.status(200).json({
         status: 'success',
         results: Contests.length,
         data: {
           Contests,
         },
       });
   });

exports.getContest = async (req, res) => {
    try {
      const Contest = await Contest.findById(req.params.id);
  
      res.status(200).json({
        status: 'success',
        data: {
            Contest,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  };

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
  const Contest = await Contest.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );

  res.status(200).json({
    status: 'success',
    data: {
        Contest,
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
  