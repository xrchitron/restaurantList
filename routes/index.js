//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const restaurants = require("./restaurants");
const users = require("./users");
const oAuth = require("./OAuth");
const authHandler = require("../middlewares/auth-handler");

router.get("/", redirectLogin);
router.use("/restaurants", authHandler, restaurants);
router.use(users);
router.use(oAuth);
//export router
module.exports = router;

function redirectLogin(req, res) {
  res.redirect("/login");
}
