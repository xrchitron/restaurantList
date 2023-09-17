//invoke express and express router
const express = require("express");
const router = express.Router();

const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/login/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/login/google", passport.authenticate("google", { scope: ["email"] }));
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
module.exports = router;
