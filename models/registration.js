const Joi = require("joi");
const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  dose: { type: String, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: [statusSchema], required: true },
});

const Registration = mongoose.model("Registration", registrationSchema);

function validateRegistration(registration) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    date: Joi.date().required().iso(),
    time: Joi.string().required(),
  });

  return schema.validate(registration);
}

module.exports.validate = validateRegistration;
module.exports.Registration = Registration;
