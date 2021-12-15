const notAuthUser = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(500)
    .json({
      msg: 'You should sign in or you can input your name and email below to comment',
    });
};

module.exports = notAuthUser;
