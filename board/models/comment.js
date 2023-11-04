'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Posts, { foreignKey: 'postid', as: 'post' });
    }
  }
  Comment.init({
    commentId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    postid: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'postid',
      }
    },
    writer: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};