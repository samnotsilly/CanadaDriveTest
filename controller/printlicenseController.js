const UserModel = require("../models/user.js");

exports.get = (req, res) => {
    if (req.session.user && req.session.user.userid) {
        UserModel.findById(req.query.userid, (e, user) => {
            const userDob = new Date(user.dob);
            console.log(user);
            res.render("printlicense", {
                currentPage: "/",
                sessiondata: req.session.user,
                data: {
                    ...user.toJSON(), // fix: bind dob field
                    dob: convertTimeToDate(userDob),
                },
            });
        });
    } else {
        res.redirect("/");
    }
};

exports.post = (req, res) => {
    console.log(req.body)
    UserModel.findByIdAndUpdate(
        req.body.id,
        {
            isPrinted: true,
        },
        {
            new: true,
        },
        (e, data) => {
            res.render("printlicense", {
                currentPage: "/",
                sessiondata: req.session.user,
                data: `${data.firstname} ${data.lastname}`,
            });
        }
    );
    
};

const convertTimeToDate = (dateValue) => {
    return `${dateValue.getFullYear()}-${(1 + dateValue.getMonth())
        .toString()
        .padStart(2, "0")}-${dateValue.getDate().toString().padStart(2, "0")}`;
};