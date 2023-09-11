//invoke express and express router
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
//invoke database
const db = require("../models");
const restaurant = db.restaurant;
//invoke functionsPool
const fcP = require("../public/javascripts/functionsPool");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const keyword = req.query.search?.trim().toLowerCase();
    const order = req.query.sort || "1";
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
          order: [[...fcP.orderCase(order)]],
        })
      : await restaurant.findAll({
          attributes: ["id", "name", "category", "image", "rating"],
          raw: true,
          order: [[...fcP.orderCase(order)]],
        });

    res.render("index", {
      restaurants: matchedRestaurant,
      keyword,
      order,
      message: req.flash("success"),
    });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, name_en, category, image, location, phone, google_map, rating, description } =
      req.body;
    await restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description,
    });
    req.flash("success", "Thanks for your support");
    res.redirect("/restaurants");
  })
);
router.get(
  "/:id",
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
module.exports = router;
