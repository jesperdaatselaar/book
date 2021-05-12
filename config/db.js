const { db } = require("./config.json");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conn established");
} catch (err) {
  console.error(err);
}

module.exports = sequelize;
