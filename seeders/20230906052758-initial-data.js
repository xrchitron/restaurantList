"use strict";
const restaurant = require("../public/jsons/restaurant.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("restaurants", restaurant.results, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("restaurants", null, {});
  },
};
