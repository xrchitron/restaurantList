const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public")); //載入靜態檔案

app.get("/", (req, res) => {
  res.send("express app for movies");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
