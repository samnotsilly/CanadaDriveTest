const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  bookingDate: Date,
  slots: [{}],
});

const AppointmentModel = mongoose.model(
  "AppointmentModel",
  appointmentSchema,
  "appointments"
);

module.exports = AppointmentModel;
