const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('../config/nodemailer');
const Product = require('../models/product.model');

const User = require('../models/user.model');

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, phoneNumber } =
    req.body;
  let errors = [];

  if (!email || !password || !firstName || !lastName || !phoneNumber) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== confirmPassword)
    errors.push({ msg: 'Passwords do not match' });

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('user/signup', {
      errors,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
    });
  } else {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        errors.push({ msg: 'User already exist' });
        res.render('user/signup', {
          errors,
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          phoneNumber,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const token = jwt.sign({ email: req.body.email }, 'secret');

      const result = await User.create({
        email,
        password: hashedPassword,
        userName: `${firstName} ${lastName}`,
        phoneNumber,
        confirmationCode: token,
      });

      req.flash(
        'success_msg',
        'User was registered successfully! Please check your email'
      );

      nodemailer.sendConfirmationEmail(
        result.userName,
        result.email,
        result.confirmationCode
      );

      res.render('user/signin');
    } catch (error) {
      errors.push({ msg: 'Some thing wrong??' });
      console.log(error);
      res.render('user/signup', {
        errors,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phoneNumber,
      });
    }
  }
};

const verifyUser = (req, res, next) => {
console.log(req.params.confirmationCode)
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      user.status = 'Active';
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });

      req.flash('success_msg', 'Verify successfuly, you can sign in now');
      res.redirect('/signin');
    })
    .catch((e) => console.log('error', e));
};

const updateInfo = async (req, res) => {
  const { userName, phoneNumber } = req.body;
  let errors = [];
  if (userName.length < 5) {
    errors.push({ msg: 'User name must be at least 5 character' });
    if (phoneNumber.length < 10) {
      console.log(phoneNumber.length);
      errors.push({ msg: 'Phone number must be at least 10 character' });
    }
    errors.push({ msg: 'Updated unsuccessful your information' });
    res.render('user/profile', { errors });
  }

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
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  let errors = [];

  try {
    const doc = await User.findOne({ _id: req.params.id });

    if (!currentPassword || !newPassword || !confirmPassword) {
      errors.push({ msg: 'Please enter all field in password' });
    }

    bcrypt.compare(currentPassword, doc.password, (error, isMatch) => {
      if (!isMatch) errors.push({ msg: 'Your password is not correct' });
    });

    if (newPassword !== confirmPassword) {
      errors.push({ msg: 'New password is not match' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
      { _id: req.params.id },
      { password: hashedPassword }
    );
    req.user = doc;
    if (errors.length === 0)
      req.flash('success_msg', 'Updated successful your password');
    res.render('user/profile', { user: doc, errors });
  } catch (error) {
    req.flash('error_msg', 'Updated unsuccessful your password');
    res.send(error);
  }
};

const signOut = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/signin');
};

const signIn = (req, res, next) => {
  //middleware helps us to attach local script to route
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);
};

const loadProfile = (req, res) => {
  res.render('user/profile');
};
const getHomePage = async (req, res) => {
  const products = await Product.find().limit(6).exec();
  res.render('index', {
    products,
  });
};

module.exports = {
  signup,
  updateInfo,
  updatePassword,
  signOut,
  signIn,
  loadProfile,
  verifyUser,
  getHomePage,
};
