const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const uploadFile = require('../s3');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/verify-email/:token', authController.verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch(
  '/update-me',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.get('/image/:key', userController.getProfilePicture);


router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get('/all-users', authController.protect, userController.getAllUsers);

router.get('/problems-stats', authController.protect, userController.getUserProblemStatistics);

router
  .route('/')
  .post(authController.protect, userController.createUser)
  .get(authController.protect, userController.getMe);


router
  .route('/:id')
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser)
  .get(authController.protect, userController.getUser);



module.exports = router;
