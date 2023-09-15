//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const restaurants = require("./restaurants");
const users = require("./users");

router.get("/", redirectLogin);
router.use("/restaurants", restaurants);
router.use(users);
//export router
module.exports = router;

function redirectLogin(req, res) {
  res.redirect("/login");
}
