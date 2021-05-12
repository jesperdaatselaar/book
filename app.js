const sequelize = require("./config/db");

const { User, Appointment } = require("./models");

const init = async () => await sequelize.sync({ force: true });

init();
