//invoke express and express router
const express = require("express");
const router = express.Router();

//invoke router module
const restaurants = require("./restaurants");

router.use("/restaurants", restaurants);

router.get("/", (req, res) => {
  res.render("login", { layout: "loginLayout" });
});

router.get("/create", (req, res) => {
  res.render("create");
});

//export router
module.exports = router;
