const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el]=obj[el];
  });
  return newObj;
  }

exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json({
        status: 'success',
        results: users.length,
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

exports.getUser = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
    try{
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: newUser,    
      });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
          });
    }
}

exports.updateUser = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: 'success',
      date: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

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
      user :updatedUser
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
