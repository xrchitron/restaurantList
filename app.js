const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
const restaurants = require("./public/jsons/restaurant.json").results;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public")); //載入靜態檔案

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
  const keyword = req.query.search?.trim();
  const matchedRestaurant = keyword
    ? restaurants.filter((store) => {
        return (
          store.name.toLowerCase().includes(keyword) ||
          store.category.toLowerCase().includes(keyword)
        );
      })
    : restaurants;
  res.render("index", { restaurants: matchedRestaurant, keyword });
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find((rest) => rest.id.toString() === id);
  res.render("detail", { restaurant });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
