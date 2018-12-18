'use strict'; 
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER 
      },
      email: {
            type: Sequelize.STRING,
            allowNull: false
      },
      pass_hash: {
            type: Sequelize.STRING,
            allowNull: false
      },
      role: {
            type: Sequelize.ENUM,
            values: ["admin", "user", "disabled"]
      },
      full_name: {
            type: Sequelize.STRING
      },
      address: {
            type: Sequelize.STRING
      },
      phone: {
            type: Sequelize.STRING
      },
      ref_token: {
            type: Sequelize.STRING(512)
      },
      created_at: {
            allowNull: false,
            type: Sequelize.DATE
      },
      updated_at: {
            allowNull: false,
            type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
