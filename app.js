const express = require("express");
const expressHbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const router = require("./routes"); //index.js would be found automatically
const app = express();
const port = 3000;

const hbs = expressHbs.create({ extname: ".hbs" });
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");
hbs.handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});
app.use(express.static("public")); //載入靜態檔案
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(router); //invoke router

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
