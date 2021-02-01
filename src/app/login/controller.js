const db = require("./model");
const User = db.user;
const config = require("../config/auth");

const { google } = require("googleapis");
const oAuth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secret,
  process.env.redirect_uri
);
oAuth2Client.setCredentials({ refresh_token: process.env.token });

const Calendar = require("../calendar");
const calendar = new Calendar(oAuth2Client);

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).render("admin/login");
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(403).render("admin/login");
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });
      res.cookie("token", token, {
        maxAge: 900000, // Lifetime
      });
      res.status(200).redirect(`/admin/dashboard`);
      console.log(token);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect("/admin/signin");
    });
};

exports.signout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
};

exports.getAvailableByDay = async (req, res) => {
  let day = req.body.day;
  let date = Date.parse(day);
  if (!day) {
    console.log("No day");
    return res.render("home", { events: [] });
  }
  const events = await calendar.getByDate(date);
  console.log(req.body.day);
  const freeEvents = [];
  if (events.data && events.data.items) {
    for (let i = 0; i < events.data.items.length; i++) {
      if (!events.data.items[i].attendees) {
        freeEvents.push(events.data.items[i]);
      }
    }
  }
  console.log(events);
  res.render("home", { events: freeEvents });
};
exports.getOccupiedByDay = async (req, res) => {
  let day = req.body.day;
  let date = Date.parse(day);
  if (!day) {
    console.log("No day");
    return res.render("admin/panel", { events: [] });
  }
  const events = await calendar.getByDate(date);
  console.log(req.body.day);
  const occupied = [];
  if (events.data && events.data.items) {
    for (let i = 0; i < events.data.items.length; i++) {
      if (events.data.items[i].attendees) {
        occupied.push(events.data.items[i]);
      }
    }
  }
  console.log(occupied);
  res.render("admin/panel", { events: occupied });
};

exports.book = async (req, res) => {
  let id = req.body.id;
  let email = req.body.email;
  const data = await calendar.addAttendee(id, email);
  console.log(data);
  res.render("home", { events: [] });
};

exports.create = async (req, res) => {
  let startInput = req.body.start;
  let endInput = req.body.end;
  if (!startInput || !endInput) {
    return res.render("admin/panel", { events: [] });
  }

  const data = await calendar.create(
    "Raccoon",
    "",
    new Date(startInput),
    new Date(endInput),
    "De Wingerd 2, 4003 EP Tiel"
  );
  console.log(data);
  res.render("admin/panel", { events: [] });
};
