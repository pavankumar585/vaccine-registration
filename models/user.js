const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },

  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150,
  },

  pincode: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },

  aadhaar: {
    type: String,
    required: true,
    unique: true,
    minlength: 12,
    maxlength: 12,
  },

  isAdmin: Boolean,
});

userSchema.methods.genAuthToken = function () {
  const { _id, isAdmin } = this;

  return jwt.sign({ _id, isAdmin }, process.env.jwtPrivateKey);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    phone: Joi.string().required().min(10).max(10),
    password: Joi.string().required().min(8).max(255),
    age: Joi.number().required().min(1).max(150),
    pincode: Joi.string().required().min(6).max(6),
    aadhaar: Joi.string().required().min(12).max(12),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
