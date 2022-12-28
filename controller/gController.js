const UserModel = require("../models/user.js");
const AppointmentModel = require("../models/appointment.js");

exports.get = async (req, res) => {
  let user = null;
  let booking = null;
  const appointmentDate = req.query.appointmentDate
    ? new Date(req.query.appointmentDate.replace(/-/g, "/"))
    : new Date();
  booking = await AppointmentModel.findOne({
    bookingDate: appointmentDate,
  });

  if (booking) {
    const convertBookingToDate = new Date(booking.bookingDate);
    booking = {
      ...booking.toJSON(),
      bookingDate: convertTimeToDate(convertBookingToDate),
      isAllSlotBooked: booking.slots.every((slot) => slot.isBooked),
    };
  } else {
    booking = {
      bookingDate: convertTimeToDate(appointmentDate),
      slots: [],
      isAllSlotBooked: true,
    };
  }
  console.log(booking);
  if (req.session.user && req.session.user.userid) {
    user = await UserModel.findById(req.session.user.userid)
      .populate("appointmentId")
      .exec();
  }
  if (user.licensenumber) {
    console.log("g", user);
    const userDob = new Date(user.dob);
    const appointmentDate = user.appointmentId
      ? new Date(user.appointmentId.bookingDate)
      : null;
    const appointmentTime = user.appointmentId
      ? user.appointmentId.slots.find(
          (v) => v.bookedBy == req.session.user.userid
        )
      : [];
    console.log("appointmentDate ::", appointmentDate);
    console.log("appointmentTime ::", appointmentTime);
    res.render("g", {
      currentPage: "/g",
      sessiondata: req.session.user,
      user: {
        ...user.toJSON(), // fix: bind dob field
        dob: convertTimeToDate(userDob),
        appointmentDate: appointmentDate && convertTimeToDate(appointmentDate),
        appointmentTime: appointmentTime,
      },
      data: null,
      booking,
    });
  } else {
    res.redirect("/g2");
  }
};

exports.post = async (req, res) => {
  if (
    req.body.address &&
    req.body.city &&
    req.body.pincode &&
    req.body.carmodal &&
    req.body.registrationyear &&
    req.body.carcompanyname
  ) {
    const user = await UserModel.findById(req.session.user.userid);

    if (user.appointmentId) {
      await removePreviousAppointment(req.session.user.userid);
    }

    const appointmentData = await updateAppointment(
      req.session.user.userid,
      req.body
    );

    UserModel.findByIdAndUpdate(
      req.session.user.userid,
      {
        ...req.body,
        appointmentId: appointmentData ? appointmentData.id : null,
        testType: "G",
        comment: "",
        status: "",
        isPrinted: false,
      },
      {
        new: true,
      },
      (e, data) => {
        res.render("g", {
          currentPage: "/g",
          sessiondata: req.session.user,
          data: "Data updated",
        });
      }
    );
  } else {
    res.render("g", {
      currentPage: "/g",
      sessiondata: req.session.user,
      data: "Address and Car details are mandatory",
    });
  }
};

const convertTimeToDate = (dateValue) => {
  return `${dateValue.getFullYear()}-${(1 + dateValue.getMonth())
    .toString()
    .padStart(2, "0")}-${dateValue.getDate().toString().padStart(2, "0")}`;
};

const removePreviousAppointment = async (userid) => {
  const user = await UserModel.findById(userid)
    .populate("appointmentId")
    .exec();
  if (user.appointmentId) {
    const appointData = await AppointmentModel.findById(user.appointmentId.id);
    const newSlots = appointData.slots.map((slot) => {
      if (slot.bookedBy == userid) {
        slot.bookedBy = "";
        slot.isBooked = false;
      }
      return slot;
    });

    await AppointmentModel.findByIdAndUpdate(user.appointmentId.id, {
      slots: [...newSlots],
    });
  }
};

const updateAppointment = async (userid, formdata) => {
  const appointData = await AppointmentModel.findOne({
    bookingDate: new Date(formdata.appointmentDate.replace(/-/g, "/")),
  });

  if (appointData) {
    const newSlots = appointData.slots.map((slot) => {
      if (slot.time == formdata.slottime) {
        slot.bookedBy = userid;
        slot.isBooked = true;
      }
      return slot;
    });

    await AppointmentModel.findByIdAndUpdate(appointData.id, {
      slots: [...newSlots],
    });
    return appointData;
  }

  return null;
};
