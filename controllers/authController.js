const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  const token = crypto.randomBytes(20).toString("hex");

  newUser.emailVerificationToken = token;

  //await newUser.save();

  // Construct the verification URL
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

  await sendEmail({
    email: newUser.email,
    subject: "verify your email",
    message: `Please click <a href="${verificationUrl}">here</a> to verify your email address.`,
  });
  createSendToken(newUser, 201, res);
});

exports.verifyEmail = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { emailVerificationToken: req.query.token },
    { emailVerified: true, emailVerificationToken: null },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired verification token.",
    });
  }
  res
    .status(200)
    .json({ status: "success", message: "Email verified successfully." });
};

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  //1)check if email and password exist
  if (!email || !password) {
    throw error("error");
  }
  //2)check if user exists & pass is okay
  const user = await User.findOne({ email: email }).select("+password");
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    throw error("incorrect");
  }
  //3)send token to client
  createSendToken(user, 200, res);
});

exports.protect = async (req, res, next) => {
  let token;
  //1)Getting token and check if its exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //console.log(token);
  if (!token) {
    throw error("there is no token");
  }
  //2)Verficiation token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  //3)Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    throw error("token : no longer exist");
  }
  //4)check if user changed password after token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    //throw error('user changed password');
  }
  //give user access to protected route
  req.user = freshUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw Error("you are not authorized");
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  //1)Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw error("user does not exist");
  }
  //2)Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3)Send it to user's email
  // const resetURL = `http://localhost:3000/login/ResetPassword/${resetToken}`;
  const message = `You requested a password reset. Click <a href="http://localhost:3000/login/resetPassword/${resetToken}">here</a> to reset your password`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: `your password reset token {valid for 10 min}`,
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    //return error;
    console.log("error sending email");
  }
};

exports.resetPassword = catchAsync(async (req, res) => {
  //1)Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)if token not expirted and user exists -> set new password
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired verification token.",
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3)Update changePasswordAt for user
  //4)Log user in , send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = async (req, res) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  //2)Check if posted current pass is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    throw error("your current password is wrong");
  }
  //3)updated password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4)log user in , send jwt
  createSendToken(user, 200, res);
};
