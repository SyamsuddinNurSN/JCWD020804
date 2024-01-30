'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Properties', [
      {
        name: 'Hotel A',
        description: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
        LocationId: 1,
        Userid: 1,
        PropertyCategoryId: 1
      },
      {
        name: 'Hotel B',
        description: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
        LocationId: 2,
        Userid: 1,
        PropertyCategoryId: 1
      },
      {
        name: 'Hotel C',
        description: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
        LocationId: 3,
        Userid: 1,
        PropertyCategoryId: 1
      },
     ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete('Properties,', null, {});
  }
};
