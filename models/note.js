'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
      Note.hasMany(models.NoteShare, { foreignKey: 'noteId' });
    }
  }
  Note.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    isArchived: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};