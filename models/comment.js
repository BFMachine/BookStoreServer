'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT
    },
    commenter_name: { 
        type: DataTypes.STRING,
        required: true,
        defaultValue: "инкогнито"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
        underscored: true
  });

  Comment.associate = function(models) {
  
    models.Comment.belongsTo(models.Book, {
        foreignKey: "book_id",
        onDelete: "CASCADE"
    });

    models.Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
    });
  };

  return Comment;
};
