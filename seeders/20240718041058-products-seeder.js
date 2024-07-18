'use strict';
const { readFile } = require('fs').promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = JSON.parse(await readFile('./data/products.json', 'utf8'));
    data.forEach(val => {
      delete val.id;
      val.createdAt = new Date();
      val.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('Products', data);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', null);
  }
};
