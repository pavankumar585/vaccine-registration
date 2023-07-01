const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const users = require("./routes/users");
const auth = require("./routes/auth");
const registrations = require("./routes/registrations");
const express = require("express");
const app = express();
require("dotenv").config();
require("./startup/db")();

app.set("view engine", "");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/registrations", registrations);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
