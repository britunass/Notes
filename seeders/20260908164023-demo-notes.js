'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" LIMIT 1;`
    );

    await queryInterface.bulkInsert('Notes', [
      {
        title: 'Купить продукты',
        content: '- Молоко, - хлеб, - сыр',
        isArchived: false,
        tags: ['покупки', 'дом'],
        userId: 7, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Лабораторная №2',
        content: 'Закончить настройку *PostgreSQL* и *Sequelize*',
        isArchived: false,
        tags: ['учеба', 'важное'],
        userId: 7, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Старая заметка',
        content: 'Эта заметка отправлена в архив',
        isArchived: true,
        tags: ['архив'],
        userId: 7, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notes', null, {});
  }
};