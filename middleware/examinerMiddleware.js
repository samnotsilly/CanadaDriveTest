module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.usertype != "examiner") {
    res.redirect("/");
  } else {
    next();
  }
};
