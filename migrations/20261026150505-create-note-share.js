'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NoteShares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noteId: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'Notes', key: 'id' }, 
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'Users', key: 'id' }, 
        onDelete: 'CASCADE'
      },
      permission: {
        type: Sequelize.STRING,
        allowNull: false,        
        defaultValue: 'read' 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('NoteShares', ['noteId', 'userId'], {
      unique: true, name: 'note_shares_note_user_unique'
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NoteShares');
  }
};