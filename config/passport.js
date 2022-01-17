const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user.model');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
		if(user) {
			if (user.status != 'Active') {
			  return done(null, false, {
				message: 'Pending Account. Please Verify Your Email!',
			  });
			}
			if (user.status != ' Deactivate') {
			  return done(null, false, {
				message: 'Your account is locked right now!',
			  });
			}
		}
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  //access the user object that above function return
  // function called by passport.session .Helps us get user data based on information stored in session and attach it to req.user
  passport.serializeUser(function (user, done) {
    done(null, user.id); //req.session.passport.user = user.id
  });
  // function called on successful authentication to save user information into session: req.user;
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
