'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notes', [
      {
        title: 'Купить продукты',
        content: '- Молоко, - хлеб, - сыр',
        isArchived: false,
        tags: ['покупки', 'дом'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Лабораторная №2',
        content: 'Закончить настройку *PostgreSQL* и *Sequelize*',
        isArchived: false,
        tags: ['учеба', 'важное'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Старая заметка',
        content: 'Эта заметка отправлена в архив',
        isArchived: true,
        tags: ['архив'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notes', null, {});
  }
};
