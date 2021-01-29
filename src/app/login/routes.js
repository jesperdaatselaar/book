const controller = require("./controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app
    .route("/admin")
    // .post(controller.signin)
    .get((req, res) => {
      res.render("admin/panel");
    });

  app.get("/signout", controller.signout);
};
