module.exports = (req, res, next) => {
  if (!(req.session.user && req.session.user.userid)) {
    res.redirect("/");
  } else {
    next();
  }
};
