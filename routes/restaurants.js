//invoke express and express router
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
//invoke database
const db = require("../models");
const restaurant = db.restaurant;
//invoke functionsPool
const fcP = require("../public/javascripts/functionsPool");

router.get("/", renderRestaurants);
router.post("/", createRestaurant);
router.get("/create", createRestaurantForm);
router.get("/edit/:id", editRestaurantPage);
router.put("/:id", updateRestaurantInfo);
router.delete("/:id", deleteRestaurant);
router.get("/:id", renderRestaurant);

module.exports = router;

//functions
async function renderRestaurants(req, res, next) {
  const keyword = req.query.search?.trim().toLowerCase();
  const order = !req.cookies.sort ? req.cookies.sort || "1" : req.query.sort || "1";
  const page = !req.cookies.page ? req.cookies.page || 1 : parseInt(req.query.page) || 1;
  const limit = 6;
  try {
    const { count, rows } = await fetchRestaurantData(keyword, order, page, limit);
    const { pageAmount, prev, next } = handlePagination(count, limit, page);
    res.cookie("sort", order);
    res.cookie("page", page);
    res.render("index", {
      restaurants: rows,
      keyword,
      order,
      prev,
      next,
      page,
      pageAmount,
    });
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
}
async function createRestaurant(req, res, next) {
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
}
async function fetchRestaurantData(keyword, order, page, limit) {
  let query = {
    attributes: ["id", "name", "name_en", "category", "image", "rating"],
    raw: true,
    order: [[...fcP.orderCase(order)]],
    offset: (page - 1) * limit,
    limit,
  };

  if (keyword) {
    query.where = {
      [Op.or]: {
        name: {
          [Op.substring]: `${keyword}`,
        },
        category: {
          [Op.substring]: `${keyword}`,
        },
      },
    };
  }

  const { count, rows } = await restaurant.findAndCountAll(query);
  return { count, rows };
}
function handlePagination(count, limit, page) {
  const pageAmount = Math.ceil(count / limit);
  const prev = page > 1 ? page - 1 : page;
  const next = page + 1;
  return { pageAmount, prev, next };
}
function createRestaurantForm(req, res, next) {
  try {
    res.render("create");
  } catch (error) {
    error.errorMessage = "Server error";
    next(error);
  }
}
async function editRestaurantPage(req, res, next) {
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
}
function updateRestaurantInfo() {
  const id = Number(req.params.id);
  try {
    const { name, name_en, category, image, location, google_map, phone, description } = req.body;
    restaurant.update(
      { name, name_en, category, image, location, google_map, phone, description },
      { where: { id } }
    );
    req.flash("success", "Update successfully");
    res.redirect(`/restaurants/${id}`);
  } catch (error) {
    error.errorMessage = "Update error";
    next(error);
  }
}
function deleteRestaurant(req, res, next) {
  const id = Number(req.params.id);
  try {
    restaurant.destroy({ where: { id } });
    req.flash("success", "Delete successfully");
    res.redirect("/restaurants");
  } catch (error) {
    error.errorMessage = "Delete error";
    next(error);
  }
}
async function renderRestaurant(req, res, next) {
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
}
