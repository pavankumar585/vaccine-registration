const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(400).send("Invalid phone or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invalid phone or password");

  const token = user.genAuthToken();
  user = _.pick(user, ["_id", "name", "phone", "age", "pincode", "aadhaar"]);

  res.setHeader("Authorization", `Bearer ${token}`).send(user);
});

function validate(user) {
  const schema = Joi.object({
    phone: Joi.string().required().min(10).max(10),
    password: Joi.string().required().min(8).max(255),
  });

  return schema.validate(user);
}

module.exports = router;
