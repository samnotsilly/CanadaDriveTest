const UserModel = require("../models/user.js");

exports.get = (req, res) => {
  res.render("signup", {
    currentPage: "/signup",
    sessiondata: req.session.user,
    msg: null,
  });
};

exports.post = async (req, res) => {
  console.log(req.body);
  if (req.body.password == req.body.repassword) {
    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
      await UserModel.create({
        ...req.body,
      });
      res.redirect("/login");
    } else {
      res.render("signup", {
        currentPage: "/signup",
        sessiondata: req.session.user,
        msg: "This username is already exist. Please enter another username",
      });
    }
  } else {
    res.render("signup", {
      currentPage: "/signup",
      sessiondata: req.session.user,
      msg: "Password and repeat password is not matched",
    });
  }
};
