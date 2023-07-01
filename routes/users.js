const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const validator = require("../middleware/validator");

router.post("/", [validator(validate)], async (req, res) => {
  let user = await User.findOne({ phone: req.body.phone });
  if (user) return res.status(400).send("User already exist");

  user = await User.findOne({ aadhaar: req.body.aadhaar });
  if (user) return res.status(400).send("Invalid aadhaar");

  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.genAuthToken();
  user = _.pick(user, ["_id", "name", "phone", "age", "pincode", "aadhaar"]);

  res.setHeader("Authorization", `Bearer ${token}`).send(user);
});

module.exports = router;
