'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
      },
      content: {
            type: Sequelize.TEXT
      },
      commenter_name: { 
            type: Sequelize.STRING,
            required: true
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
    return queryInterface.dropTable('Comments');
  }
};