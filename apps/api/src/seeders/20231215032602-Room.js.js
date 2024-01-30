'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rooms', [
      {
        room_name: 'Room A',
        description: 'abc',
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
        PropertyId: 4
      },
      {
        room_name: 'Room B',
        description: 'abc',
        price: 300000,
        createdAt: new Date(),
        updatedAt: new Date(),
        PropertyId: 4
      },
      {
        room_name: 'Room C',
        description: 'abc',
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
        PropertyId: 5
      },
      {
        room_name: 'Room D',
        description: 'abc',
        price: 400000,
        createdAt: new Date(),
        updatedAt: new Date(),
        PropertyId: 5
      },
      {
        room_name: 'Room E',
        description: 'abc',
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        PropertyId: 6
      },
      
     ], {});
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Rooms,', null, {});
  }
};
