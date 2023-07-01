const moment = require("moment");
const express = require("express");
const router = express.Router();
const { Registration, validate } = require("../models/registration");
const validator = require("../middleware/validator");

router.post("/", [validator(validate)], async (req, res) => {
  let { user, date, time } = req.body;
  date = date.split("T")[0];

  const startDate = moment("2021-06-01");
  const endDate = moment("2021-06-30").endOf("day");
  const selectedDate = moment(date);

  if (!selectedDate.isBetween(startDate, endDate, "days", "[]"))
    return res.status(400).send("Invalid date");

  const startTime = moment("10:00:00", "HH:mm:ss");
  const endTime = moment("16:30:00", "HH:mm:ss");

  const formatedTime = moment(time, "hh:mm A").format("HH:mm:ss");
  const selectedTime = moment(formatedTime, "HH:mm:ss");

  if (!selectedTime.isBetween(startTime, endTime, null, "[]"))
    return res.status(400).send("invalid time slot");

  const minutes = parseInt(selectedTime.format("mm"));
  if (minutes % 30 !== 0) return res.status(400).send("Invalid time slot");

  const count = await Registration.find({
    "status.date": new Date(`${date}T${formatedTime}.000Z`),
  }).count();
  if (count === 10)
    return res.status(400).send("Slots are full for given time");

  let registration = await Registration.findOne({ user });

  if (registration && registration.status[1])
    return res.status(400).send("Your vaccination has already completed.");

  if (!registration) {
    const registred = await Registration.create({
      user,
      status: [
        { dose: "first", date: new Date(`${date}T${formatedTime}.000Z`) },
      ],
    });

    return res.send(registred);
  }

  const currentDate = moment("2021-06-01T11:00:00.000Z");
  const registeredDate = moment(registration.status[0].date).add(30, "minutes");

  if (!registration.status[0].completed)
    return res.status(400).send("Your first dose not completed");

  registration.status.push({
    dose: "second",
    date: new Date(`${date}T${formatedTime}.000Z`),
  });
  const registred = await registration.save();

  res.send(registred);
});

module.exports = router;
