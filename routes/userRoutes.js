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
  .route('/:id/problems-stats')
  .get( authController.protect, userController.getProblemsStats);

router
  .route('/:id')
  .patch(authController.protect ,userController.updateUser)
  .delete(authController.protect,userController.deleteUser);

router.get('/',authController.protect,userController.getUser);

router.get('/allUsers',authController.protect , authController.restrictTo('admin') ,userController.getAllUsers);

router
  .route('/')
  .post(authController.protect , authController.restrictTo('admin'), userController.createUser);




module.exports = router;
