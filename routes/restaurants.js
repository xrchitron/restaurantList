//invoke express and express router
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
//invoke database
const db = require("../models");
const restaurant = db.restaurant;
//invoke functionsPool
const fcP = require("../public/javascripts/functionsPool");

router.get("/", async (req, res, next) => {
  const keyword = req.query.search?.trim().toLowerCase();
  const order = !req.cookies.sort ? req.cookies.sort : req.query.sort || "1";
  const page = !req.cookies.page ? req.cookies.page : parseInt(req.query.page) || 1;
  const limit = 6;
  try {
    if (keyword) {
      var { count, rows } = await restaurant.findAndCountAll({
        attributes: ["id", "name", "name_en", "category", "image", "rating"],
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
        offset: (page - 1) * limit,
        limit,
      });
    } else {
      var { count, rows } = await restaurant.findAndCountAll({
        attributes: ["id", "name", "name_en", "category", "image", "rating"],
        raw: true,
        order: [[...fcP.orderCase(order)]],
        offset: (page - 1) * limit,
        limit,
      });
    }
    const matchedRestaurant = rows;
    const pageAmount = Math.ceil(count / limit);
    res.cookie("sort", order);
    res.cookie("page", page);
    res.render("index", {
      restaurants: matchedRestaurant,
      keyword,
      order,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page,
      pageAmount,
    });
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
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
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});

router.get("/create", (req, res, next) => {
  try {
    res.render("create");
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});
router.get("/edit/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const restaurant_content = await restaurant.findAll({
      raw: true,
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    res.render("edit", { restaurant: restaurant_content[0] });
  } catch (error) {
    error.errorMessage = "Edit failure";
    next(error);
  }
});
router.put("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const { name, name_en, category, image, location, google_map, phone, description } = req.body;
    await restaurant.update(
      { name, name_en, category, image, location, google_map, phone, description },
      { where: { id } }
    );
    req.flash("success", "Update successfully");
    res.redirect(`/restaurants/${id}`);
  } catch (error) {
    error.errorMessage = "Update error";
    next(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    await restaurant.destroy({ where: { id } });
    req.flash("success", "Delete successfully");
    res.redirect("/restaurants");
  } catch (error) {
    error.errorMessage = "Delete error";
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const restaurant_content = await restaurant.findAll({
      raw: true,
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    res.render("detail", { restaurant: restaurant_content[0] });
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
});
module.exports = router;
