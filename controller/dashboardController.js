const UserModel = require("../models/user.js");

exports.get = async (req, res) => {
  console.log(req.query.status);
  if (req.session.user && req.session.user.usertype == 'driver') {
    const user = await UserModel.findById(req.session.user.userid).populate("appointmentId").exec();
    const userDob = new Date(user.dob);
    const appointmentDate = user.appointmentId
      ? new Date(user.appointmentId.bookingDate)
      : null;

    const appointmentTime = user.appointmentId
      ? user.appointmentId.slots.find(
        (v) => v.bookedBy == req.session.user.userid
      )
      : [];

    console.log(user);
    res.render("index", {
      currentPage: "/", sessiondata: req.session.user, data: {
        ...user.toJSON(),
        dob: convertTimeToDate(userDob),
        appointmentDate: appointmentDate && convertTimeToDate(appointmentDate),
        appointmentTime: appointmentTime,
      }
    });
  } else if (req.session.user && req.session.user.usertype == 'examiner') {
    const users = await UserModel.find({usertype: 'driver',  testType: (req.query.status && req.query.status != 'all' ? req.query.status.toUpperCase() : { $ne: null }), appointmentId: {$ne: null} }).populate("appointmentId").exec();
    console.log(users);
    const userList = users.map(val=>{
      const appointmentDate = val.appointmentId
      ? new Date(val.appointmentId.bookingDate)
      : null;

    const appointmentTime = val.appointmentId
      ? val.appointmentId.slots.find(
        (v) => v.bookedBy == val.id
      )
      : [];
      return {
        name: `${val.firstname} ${val.lastname}`,
        testType: val.testType,
        carDetails: `${val.carcompanyname} ${val.carmodal}`,
        licensenumber: val.licensenumber,
        status: val.status || 'Pending',
        appointment: `${convertTimeToDate(appointmentDate)} | ${appointmentTime.time}`,
        action : val.status ? 'action' : val.id 
      }
    });
    res.render("index", {
      currentPage: "/", sessiondata: req.session.user, 
        currentSelectedFilter: req.query.status,
        data: {
        headers: {
          name: 'Name',
          testType: 'Test type',
          carDetails: 'Car Details',
          licensenumber: 'License Number',
          status: 'Status',
          appointment: 'Appointment',
          action: 'Action'
        },
        rows: [...userList]
      }
    });

  } else if (req.session.user && req.session.user.usertype == 'admin') {
    const users = await UserModel.find({usertype: 'driver',  status: (req.query.status && req.query.status != 'all' ? req.query.status.toLowerCase() : { $ne: null }), appointmentId: {$ne: null} }).populate("appointmentId").exec();
    const userList = users.map(val=>{
      const appointmentDate = val.appointmentId
      ? new Date(val.appointmentId.bookingDate)
      : null;

    const appointmentTime = val.appointmentId
      ? val.appointmentId.slots.find(
        (v) => v.bookedBy == val.id
      )
      : [];
      return {
        name: `${val.firstname} ${val.lastname}`,
        testType: val.testType,
        carDetails: `${val.carcompanyname} ${val.carmodal}`,
        licensenumber: val.licensenumber,
        status: val.status || 'Pending',
        appointment: `${convertTimeToDate(appointmentDate)} | ${appointmentTime.time}`,
        action : val.status && val.status == 'pass' && !val.isPrinted ? val.id : 'action' 
      }
    });
    res.render("index", {
      currentPage: "/", sessiondata: req.session.user, 
        currentSelectedFilter: req.query.status,
        data: {
        headers: {
          name: 'Name',
          testType: 'Test type',
          carDetails: 'Car Details',
          licensenumber: 'License Number',
          status: 'Status',
          appointment: 'Appointment',
          action: 'Action'
        },
        rows: [...userList]
      }
    });
  } else {
    res.render("index", {
      currentPage: "/", sessiondata: req.session.user, data: null
    });
  }
};

const convertTimeToDate = (dateValue) => {
  return `${dateValue.getFullYear()}-${(1 + dateValue.getMonth())
    .toString()
    .padStart(2, "0")}-${dateValue.getDate().toString().padStart(2, "0")}`;
};
