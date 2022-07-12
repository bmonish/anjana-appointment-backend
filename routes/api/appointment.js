const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Appointment = require("../../models/Appointment");
const User = require("../../models/User");

router.post(
  "/",
  [
    auth,
    [
      check("date", "Date is required").not().isEmpty(),
      check("title", "Title is required").not().isEmpty(),
      check("price", "Price is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { date, title, price, doctor } = req.body;

    try {
      const appointment = new Appointment({
        date,
        title,
        price,
        doctor,
        patient: req.user.id,
      });

      await appointment.save();

      res.json(appointment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/myappointments", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.userType == "doctor") {
      const appointments = await Appointment.find({
        doctor: req.user.id,
      })
        .populate("patient")
        .populate("doctor");

      res.json(appointments);
    } else {
      const appointments = await Appointment.find({
        patient: req.user.id,
      })
        .populate("patient")
        .populate("doctor");

      res.json(appointments);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:appointmentId", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate("patient")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.patch("/:appointmentId", auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, title, price, doctor } = req.body;

    const appointment = await Appointment.findOne({ _id: appointmentId });

    if (!appointment) {
      return res
        .status(402)
        .json({ errors: [{ msg: "Appointment Does not Exist" }] });
    }

    await Appointment.updateOne(
      { _id: appointmentId },
      { date, title, price, doctor }
    );

    const updatedAppointment = await Appointment.findOne({
      _id: appointmentId,
    });
    res.json(updatedAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:appointmentId", auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ _id: appointmentId });

    if (!appointment) {
      return res
        .status(402)
        .json({ errors: [{ msg: "Appointment Does not Exist" }] });
    }

    await Appointment.deleteOne({ _id: appointmentId });

    res.json({ msg: "Appointment Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
