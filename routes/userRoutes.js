const express = require("express");
const multer = require('multer');
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const upload = multer({ dest: ''});

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/verify-email/:token', authController.verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', upload.single('profilePic'), authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get('/all-users', authController.protect, userController.getAllUsers);

router.get('/problems-stats', authController.protect, userController.getUserProblemStatistics);

router
  .route('/')
  .post(authController.protect, authController.restrictTo('admin'), userController.createUser)
  .get(authController.protect, authController.restrictTo('admin'), userController.getMe);


router
  .route('/:id')
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser)
  .get(authController.protect, userController.getUser);



module.exports = router;
