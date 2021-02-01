const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", express.static("/src/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

const db = require("./src/app/login/model");
const User = db.user;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Resync Db");
  initial();
});

// Routes
require("./src/app/login/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  User.create({
    firstName: "Roelie",
    lastName: "Janssen",
    email: "info@voetreflexraccoon.nl",
    password: bcrypt.hashSync("ditisnietveilig", 8),
  });
  User.create({
    firstName: "Jesper",
    lastName: "van Daatselaar",
    email: "1002003@hr.nl",
    password: bcrypt.hashSync("ditisnietveilig", 8),
  });
}
