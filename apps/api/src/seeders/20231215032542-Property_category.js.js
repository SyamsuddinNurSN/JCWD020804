'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('Property_categories', [
      {
        name: 'Villa',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        name: 'Hotel',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      {
        name: 'Homestay',
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Property_categories,', null, {});
  },
};
