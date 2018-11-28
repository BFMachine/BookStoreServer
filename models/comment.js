'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};