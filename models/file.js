'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    name: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    type: {
      type: DataTypes.ENUM,
      values: ["cover", "text", "another"],
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
      underscored: true
});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};