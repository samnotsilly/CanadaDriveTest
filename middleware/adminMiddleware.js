module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.usertype != "admin") {
    res.redirect("/");
  } else {
    next();
  }
};
