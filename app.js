const express = require("express");
const { engine } = require("express-handlebars");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const app = express();
const port = 3000;
// const restaurants = require("./public/jsons/restaurant.json").results;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public")); //載入靜態檔案

//invoke database
const db = require("./models");
// const restaurant = require("./models/restaurant");
const restaurant = db.restaurant;

app.get("/", (req, res) => {
  res.render("login", { layout: "loginLayout" });
});

app.get(
  "/restaurants",
  asyncHandler(async (req, res) => {
    const keyword = req.query.search?.trim().toLowerCase();
    const matchedRestaurant = keyword
      ? await restaurant.findAll({
          attributes: ["id", "name", "category", "image", "rating"],
          raw: true,
          where: {
            [Op.or]: {
              name: {
                [Op.substring]: `${keyword}`,
              },
              category: {
                [Op.substring]: `${keyword}`,
              },
            },
          },
        })
      : await restaurant.findAll({
          attributes: ["id", "name", "category", "image", "rating"],
          raw: true,
        });
    res.render("index", { restaurants: matchedRestaurant, keyword });
  })
);
app.post("/restaurants", (req, res) => {
  res.redirect("/restaurants");
});
app.get(
  "/restaurants/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const restaurant_content = await restaurant.findAll({
      attributes: [
        "id",
        "name",
        "name_en",
        "category",
        "image",
        "location",
        "phone",
        "google_map",
        "rating",
        "description",
      ],
      raw: true,
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    res.render("detail", { restaurant: restaurant_content[0] });
  })
);

app.get("/user", (req, res) => {
  res.render("user");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
