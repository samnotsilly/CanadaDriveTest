const bcrypt = require("bcrypt");
const UserModel = require("../models/user.js");
exports.get = (req, res) => {
  res.render("login", {
    currentPage: "/login",
    sessiondata: req.session.user,
    msg: null,
  });
};

exports.post = async (req, res) => {
  if (req.body.username) {
    const user = await UserModel.findOne({
      username: req.body.username,
    });
    console.log(user);
    if (user) {
      bcrypt.compare(req.body.password, user.password, (e, isMatched) => {
        console.log(isMatched);
        if (isMatched) {
          req.session.user = {
            userid: user.id,
            usertype: user.usertype,
          };
          res.redirect("/");
        } else {
          res.render("login", {
            currentPage: "/login",
            sessiondata: req.session.user,
            msg: "Password is not correct",
          });
        }
      });
    } else {
      res.redirect("/signup");
    }
  }
};
