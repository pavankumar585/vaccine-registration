const mongoose = require("mongoose");

module.exports = async function () {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.db);
    console.log(`Connected to ${process.env.db}...`);
  } catch (error) {
    console.log(error.message);
  }
};
