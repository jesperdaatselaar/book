const jwt = require("jsonwebtoken");
const config = require("../config/auth");
const db = require("./model");
const verifyToken = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(403).redirect("/admin/signin");
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).redirect("/admin/signin");
    } else {
      req.user = decoded.id;
    }
  });
  next();
};

module.exports = verifyToken;
