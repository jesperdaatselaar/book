const { User, Appointment } = require("../models");
const sequelize = require("../config/db.js");

module.exports = class Auth {
  register = (req) => {
    if (!req.body) return "Invalid request";
    let email = req.body.email,
      password = req.body.password,
      firstName = req.body.firstName,
      lastName = req.body.lastName,
      phoneNumber = req.body.phoneNumber;

    if (!email) return "Invalid email";
    if (!password) return "Invalid password";
    if (!firstName || !lastName || !phoneNumber) return "Missing information";

    sequelize.sync();
    const user = User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    console.log(`Created ${user.firstName} ${user.lastName}'s account`);
  };
};
