const passport = require("passport");
//invoke database
const db = require("../models");
const User = db.User;
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth");
const xStrategy = require("passport-twitter");
const bcrypt = require("bcryptjs");
require("dotenv").config();

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    //checkExistingUser
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        //checkExistingUser
        if (!user) {
          return done(null, false, { message: "email or password incorrect" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          //checkPasswordMatch
          if (!isMatch) {
            return done(null, false, { message: "email or password incorrect" });
          }
          //get user info
          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "login failure";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      return User.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      }).then((user) => {
        if (user) return done(null, user);

        const randomPwd = Math.random().toString(36).slice(-8);
        return bcrypt
          .hash(randomPwd, 10)
          .then((hash) => {
            User.create({ name, email, password: hash });
          })
          .then((user) => {
            done(null, { id: user.id, name: user.name, email: user.email });
          })
          .catch((error) => {
            error.errorMessage = "Login Failure";
            done(error);
          });
      });
    }
  )
);
//當驗證成功後，serializeUser會將使用者物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式。換句話說，他的作用在於要存什麼資料到 session 然後讓 passport 在登入流程中呼叫。
passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

module.exports = passport;
