const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const passport = require('passport');

const signup = require('../authController/user').signup;
const Authenticated = require('../middleware/auth').checkAuthenticated;
const notAuthenticated = require('../middleware/auth').checkNotAuthenticated;

router.get('/', Authenticated, (req, res) => {
  res.render('user/profile');
});

router.post('/sign-up', signup);

router.post('/sign-in', notAuthenticated, (req, res, next) => {
  //middleware helps us to attach local script to route
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);
});

router.get('/signout', Authenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/signin');
});

router.patch('/:id', async (req, res) => {
  const { userName, phoneNumber } = req.body;
  console.log(userName, phoneNumber);
  console.log(req.user);
  try {
    const doc = await User.findOneAndUpdate(
      { _id: req.params.id },
      { userName, phoneNumber },
      { new: true }
    );
    req.user = doc;
    req.flash('success_msg', 'Updated successful your information');
    res.render('user/profile', { user: doc });
  } catch (error) {
    req.flash('error_msg', 'Updated unsuccessful your information');
    res.send(error);
  }
});
router.patch('/update_password/:id', async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  console.log(userName, phoneNumber);
  console.log(req.user);
  try {
    const doc = await User.findOneAndUpdate(
      { _id: req.params.id },
      { userName, phoneNumber },
      { new: true }
    );
    req.user = doc;
    req.flash('success_msg', 'Updated successful your information');
    res.render('user/profile', { user: doc });
  } catch (error) {
    req.flash('error_msg', 'Updated unsuccessful your information');
    res.send(error);
  }
});

module.exports = router;
