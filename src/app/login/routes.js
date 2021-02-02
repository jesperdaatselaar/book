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
        error: undefined,
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
      res.render("admin/login", { error: undefined });
    });
  app
    .route("/admin/dashboard")
    .get([verifyToken], (req, res) => {
      res.render("admin/panel", { events: [], error: undefined });
    })
    .post([verifyToken], controller.getOccupiedByDay);

  app.route("/book").post(controller.book);

  app.route("/admin/create").post([verifyToken], controller.create);
  app.route("/admin/cancel").post([verifyToken], controller.cancel);
  app.route("/admin/delete").post([verifyToken], controller.delete);

  app.get("/signout", [verifyToken], controller.signout);
};
