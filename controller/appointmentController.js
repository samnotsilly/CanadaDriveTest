const AppointmentModel = require("../models/appointment.js");
const parseTime = (time) => {
  const splitTime = time.split(":");
  return splitTime[0] * 60 + +splitTime[1];
};

const generateSlot = (startTime) => {
  const hours = Math.floor(startTime / 60);
  const mins = Math.floor(startTime % 60);
  return (
    hours.toString().padStart(2, "0") + ":" + mins.toString().padStart(2, "0")
  );
};
const getSlots = (alreadyAddedSlots = [], startVal = "9:00", endVal = "14:00") => {
  console.log(alreadyAddedSlots);
  let startTime = parseTime(startVal);
  const endTime = parseTime(endVal);
  const interval = 30;
  const slots = [];

  while (startTime <= endTime) {
    const newTime = generateSlot(startTime);
    slots.push({
      time: newTime,
      isBooked: false,
      isAdded:
        alreadyAddedSlots.findIndex((s) => s.time == newTime) == -1
          ? false
          : true,
    });
    startTime = startTime + interval;
  }

  return slots;
};

exports.get = async (req, res) => {
  console.log(req.query);
  if (Object.keys(req.query).length > 0) {
    const bookingDate = new Date(req.query.appointmentDate.replace(/-/g, '\/'));

    const booking = await AppointmentModel.findOne({
      bookingDate,
    });

    if (booking) {
      res.render("appointment", {
        currentPage: "/appointment",
        sessiondata: req.session.user,
        bookingDate: convertTimeToDate(bookingDate),
        slots: getSlots(booking.slots),
        msg: "",
      });
    } else {
      res.render("appointment", {
        currentPage: "/appointment",
        sessiondata: req.session.user,
        bookingDate: convertTimeToDate(bookingDate),
        slots: getSlots(),
        msg: "",
      });
    }
  } else {
    res.render("appointment", {
      currentPage: "/appointment",
      sessiondata: req.session.user,
      bookingDate: "",
      slots: [],
      msg: "",
    });
  }
};

exports.post = async (req, res) => {
  console.log(req.body);
  const bookingDate =  new Date(req.body.appointmentDate.replace(/-/g, '\/'));

  const bookingSlot = [];
  for (let key in req.body) {
    if (key != "appointmentDate") {
      bookingSlot.push({
        bookedBy: "",
        time: key.split("_")[1],
        isBooked: false,
      });
    }
  }

  const booking = await AppointmentModel.findOne({
    bookingDate,
  });

  if (booking) {
    await AppointmentModel.findByIdAndUpdate(booking.id, {
      slots: [...booking.slots, ...bookingSlot],
    });

    res.render("appointment", {
      currentPage: "/appointment",
      sessiondata: req.session.user,
      bookingDate: convertTimeToDate(bookingDate),
      slots: [],
      msg: "Data updated successfully",
    });
  } else {
    const appointment = await AppointmentModel.create({
      bookingDate,
      slots: [...bookingSlot],
    });
    if (appointment) {
      res.render("appointment", {
        currentPage: "/appointment",
        sessiondata: req.session.user,
        bookingDate: convertTimeToDate(bookingDate),
        slots: [],
        msg: "Data added successfully",
      });
    } else {
      res.render("appointment", {
        currentPage: "/appointment",
        sessiondata: req.session.user,
        bookingDate: convertTimeToDate(bookingDate),
        slots: getSlots(bookingSlot),
        msg: "There is some issue in saving data",
      });
    }
  }
};

const convertTimeToDate = (dateValue)=>{
  return `${dateValue.getFullYear()}-${(1 + dateValue.getMonth())
    .toString()
    .padStart(2, "0")}-${(dateValue.getDate())
    .toString()
    .padStart(2, "0")}`;
}

