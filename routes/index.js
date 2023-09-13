//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const restaurants = require("./restaurants");

router.get("/", renderLogin);

router.use("/restaurants", restaurants);

//export router
module.exports = router;

function renderLogin(req, res) {
  res.render("login", { layout: "loginLayout" });
}
