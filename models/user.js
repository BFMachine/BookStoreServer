'use strict';
let bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        /*  validate: { 
          isEmail: true
        } */   
    },
    pass_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.generateHash = function (password) {
    return bcrypt.hashSync(password, saltRounds);
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  return User;
};
