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
    user_id: {
        type: DataTypes.INTEGER
    }
  }, {
        underscored: true
  });
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};