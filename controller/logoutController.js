exports.get = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
