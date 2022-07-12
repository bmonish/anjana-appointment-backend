const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  title: {
    type: String,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  price: {
    type: Number,
  },
});

module.exports = Appointment = mongoose.model("appointment", AppointmentSchema);
