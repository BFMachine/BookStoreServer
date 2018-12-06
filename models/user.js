'use strict';
let bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pass_hash: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ["admin", "user", "disabled"]
    },
    full_name: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    ref_token: {
        type: DataTypes.STRING(512)
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
  User.associate = function(models) {
    models.User.hasMany(models.Comment, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
    });

    models.User.hasMany(models.Order, {
        foreignKey: "user_id",
        onDelete: "CASCADE"
    });

  };

  User.generateHash = function (password) {
    return bcrypt.hashSync(password, saltRounds);
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.pass_hash);
  }

  return User;
};
