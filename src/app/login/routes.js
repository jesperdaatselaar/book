const controller = require("./controller");
const verifyToken = require("./middleware");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app
    .route("/")
    .get((req, res) => {
      res.render("home", {
        events: [],
      });
    })
    .post(controller.getAvailableByDay);

  app
    .route("/admin/signin")
    .post(controller.signin)
    .get((req, res) => {
      if (req.user) {
        return res.redirect("/admin/dashboard");
      }
      res.render("admin/login");
    });
  app.route("/admin/dashboard").get([verifyToken], (req, res) => {
    res.render("admin/panel");
  });
  app
    .route("/admin/dashboard/:date")
    .get([verifyToken], controller.getAvailableByDay);

  app.get("/signout", [verifyToken], controller.signout);
};
