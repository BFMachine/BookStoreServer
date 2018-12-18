'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 
      'Comments', 
      'user_id', 
      {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Users', 
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Comments', 
      'user_id' 
    );
  }
};
