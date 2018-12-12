'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
