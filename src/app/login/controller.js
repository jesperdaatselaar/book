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
  let date = Date.parse(req.body.day);
  const events = await calendar.getByDate(date);
  const freeEvents = [];

  for (let i = 0; i < events.data.items.length; i++) {
    const element = events.data.items[i];
    if (!events.data.items[i].attendees) {
      freeEvents.push(events.data.items[i]);
    }
  }
  console.log(events);
  res.render("home", { events: freeEvents });
};
