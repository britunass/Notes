'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NoteShare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NoteShare.belongsTo(models.Note,{foreignKey: 'noteId'});
      NoteShare.belongsTo(models.User,{foreignKey: 'userId'});
    }
  }
  NoteShare.init({
    noteId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    permission: {
      type: DataTypes.STRING,
      defaultValue: 'read',
      validate: { isIn: [['read', 'edit']] }
    }
  }, {
    sequelize,
    modelName: 'NoteShare',
  });
  return NoteShare;
};