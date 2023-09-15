const passport = require("passport");
//invoke database
const db = require("../models");
const user = db.User;
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth");
const xStrategy = require("passport-twitter");
const bcrypt = require("bcryptjs");

module.exports = passport;
