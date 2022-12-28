const express = require("express");
const router = express.Router();
const dashboardController = require("./controller/dashboardController.js");
const g2Controller = require("./controller/g2Controller.js");
const appointmentController = require("./controller/appointmentController.js");
const gController = require("./controller/gController.js");
const reviewProfileController = require("./controller/reviewProfileController");
const printlicenseController = require("./controller/printlicenseController");
const signupController = require("./controller/signupController.js");
const loginController = require("./controller/loginController.js");
const logoutController = require("./controller/logoutController.js");
const authMiddleware = require("./middleware/authMiddleware.js");
const driverMiddleware = require("./middleware/driverMiddleware.js");
const adminMiddleware = require("./middleware/adminMiddleware.js");
const examinerMiddleware = require("./middleware/examinerMiddleware.js");
const nonAuthMiddleware = require("./middleware/nonAuthMiddleware.js");

router.get("", dashboardController.get);

router.get("/g2", [authMiddleware, driverMiddleware], g2Controller.get);
router.post("/g2", g2Controller.post);

router.get("/g", [authMiddleware, driverMiddleware], gController.get);
router.post("/g", gController.post);


router.get(
  "/appointment",
  [authMiddleware, adminMiddleware],
  appointmentController.get
);

router.post(
  "/appointment",
  [authMiddleware, adminMiddleware],
  appointmentController.post
);

router.get("/reviewprofile", [authMiddleware, examinerMiddleware], reviewProfileController.get);
router.post("/reviewprofile", [authMiddleware, examinerMiddleware], reviewProfileController.post);

router.get("/printlicense", [authMiddleware, adminMiddleware], printlicenseController.get);
router.post("/printlicense", [authMiddleware, adminMiddleware], printlicenseController.post);

router.get("/signup", nonAuthMiddleware, signupController.get);
router.post("/signup", signupController.post);

router.get("/login", nonAuthMiddleware, loginController.get);
router.post("/login", loginController.post);

router.get("/logout", authMiddleware, logoutController.get);

router.get("*", (req, res) => {
  res.render("404", { currentPage: "", sessiondata: req.session.user });
});

module.exports = router;
