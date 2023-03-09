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
router.delete('/DeleteMe', authController.protect , userController.deleteMe);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(authController.protect ,userController.updateUser)
  .delete(authController.protect,userController.deleteUser);

router
  .route('/')
  .get(authController.protect , authController.restrictTo('admin') ,userController.getAllUsers)
  .post(authController.protect , authController.restrictTo('admin'), userController.createUser);

module.exports = router;
