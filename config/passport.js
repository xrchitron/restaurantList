const passport = require("passport");
//invoke database
const db = require("../models");
const User = db.User;
const queryInterface = db.sequelize.getQueryInterface();
const restaurant = require("../public/jsons/restaurantDefault.json");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth2");
const bcrypt = require("bcryptjs");
require("dotenv").config();

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategyExecute));

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    thirdPartyStrategyExecute
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    thirdPartyStrategyExecute
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
async function thirdPartyStrategyExecute(accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const user = await User.findOne({
      attributes: ["id", "name", "email"],
      where: { email },
      raw: true,
    });
    if (user) return done(null, user);
    const randomPwd = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(randomPwd, 10);
    await User.create({ name, email, password: hash });
    // < note: same code reference by routes/users >
    // find the newest userId which just added
    const userId = await User.findAll({
      order: [["id", "DESC"]],
      limit: 1,
      raw: true,
    });
    //added userId into default restaurants json file
    restaurant.results.forEach((result) => {
      result.userId = userId[0].id;
    });
    //bulkInsert default restaurants' info into database
    await queryInterface.bulkInsert("restaurants", restaurant.results, {});
    // < note: same code reference by routes/users >
    await done(null, { id: user.id, name: user.name, email: user.email });
  } catch (error) {
    error.errorMessage = "Login Failure";
    done(error);
  }
}

async function localStrategyExecute(username, password, done) {
  try {
    const user = await User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    });
    if (!user) return done(null, false, { message: "email or password incorrect" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "email or password incorrect" });
    }
    //get user info
    return done(null, user);
  } catch (error) {
    error.errorMessage = "login failure";
    done(error);
  }
}
