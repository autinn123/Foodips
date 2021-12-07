const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

      const result = await User.create({
        email,
        password: hashedPassword,
        userName: `${firstName} ${lastName}`,
        phoneNumber,
      });

      req.flash('success_msg', 'You are now signed up and can sign in');
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

module.exports = { signup };
