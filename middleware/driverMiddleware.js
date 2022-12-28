module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.usertype != "driver") {
    res.redirect("/");
  } else {
    next();
  }
};
