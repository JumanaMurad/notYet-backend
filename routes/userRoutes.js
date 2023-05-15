const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword' ,authController.protect , authController.updatePassword);

router.patch('/updateMe', authController.protect , userController.updateMe);
router.delete('/deleteMe', authController.protect , userController.deleteMe);


router.get('/problems-stats/:id', authController.protect, userController.getUserProblemStatistics);

router
  .route('/:id')
  .patch(authController.protect ,userController.updateUser)
  .delete(authController.protect,userController.deleteUser);

//router.get('/',authController.protect,userController.getUser);

router.get('/all-users',authController.protect , authController.restrictTo('admin') ,userController.getAllUsers);

router
  .route('/')
  .post(authController.protect , authController.restrictTo('admin'), userController.createUser)
  .get(authController.protect,userController.getUser);


module.exports = router;
