exports.signout = (req, res) => {
  // res.cookie("token", "", { maxAge: 0 });
  // res.cookie("user", "", { maxAge: 0 });
  res.redirect("/");
};
