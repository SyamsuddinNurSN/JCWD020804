'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Locations', [
      {
        city: 'Jakarta',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city: 'Bandung',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city: 'Surabaya',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Locations,', null, {});
  }
};
