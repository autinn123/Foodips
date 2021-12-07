const jwt = require('jsonwebtoken');

const checkAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/signin');
};

const checkNotAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
};

module.exports = { checkAuthenticated, checkNotAuthenticated };
