const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: String,
  usertype: String,
  firstname: String,
  lastname: String,
  username: String,
  dob: Date,
  address: String,
  city: String,
  pincode: String,
  carmodal: String,
  registrationyear: String,
  carcompanyname: String,
  licensenumber: String,
  docs: String,
  testType: String,
  comment: String,
  status: String,
  isPrinted: Boolean,
  appointmentId: { type: mongoose.Types.ObjectId, ref:'AppointmentModel'}
});

userSchema.pre("save", function (next) {
  const SALT = 5;
  bcrypt.hash(this.password, SALT).then((encryptedPassword) => {
    this.password = encryptedPassword;
     next();
  });
 
});

const UserModel = mongoose.model("UserModel", userSchema, "users");

module.exports = UserModel;
