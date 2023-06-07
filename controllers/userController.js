const multer = require('multer');
const sharp = require('sharp');
const AppError = require("./../utils/appError");
const User = require('../models/userModel');
const Problem = require('../models/problemModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`img/${req.file.filename}`);

  next();
});


const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el]=obj[el];
  });
  return newObj;
}

exports.getAllUsers = catchAsync(async (req, res) => {
  // EXECUTE A QUERY
  const features = new APIFeatures(User.find({ role: 'user' }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  if (!users) {
    return next(new AppError('not found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.getMe = catchAsync(async (req, res) => {
  
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });

}
);

exports.getUser = catchAsync( async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
      status: 'success',
      data: newUser,    
    });
}
);

exports.updateUser = catchAsync(async (req, res) => {
    console.log(req.file);
    console.log(req.body);

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
  await User.findByIdAndRemove(req.params.id);

  res.status(204).json({
    message: 'Deleted Successfully'
  });

});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log("Updateme: ", req.file)
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = async (req,res) => {
  await User.findByIdAndUpdate(req.user.id , {active : false});
  res.status(204).json({
    status:'success',
    data : null
  });
}

// Needs investigation
exports.getUserProblemStatistics = catchAsync( async (req, res) => {
    console.log('req.user:', req.user);
    const user = await User.findById(req.user._id).populate('submittedProblems.problem');

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
  }
);
