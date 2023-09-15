//invoke express and express router
const express = require("express");
const router = express.Router();
router.get("/login", renderLogin);
router.get("/register", renderRegister);
module.exports = router;
function renderLogin(req, res) {
  res.render("login", { layout: "loginLayout" });
}
function renderRegister(req, res) {
  res.render("register", { layout: "loginLayout" });
}
