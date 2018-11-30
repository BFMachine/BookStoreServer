'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 
      'Comments', 
      'book_id',  
      {
        type: Sequelize.INTEGER, 
        references: {
          model: 'Books', 
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
      'book_id' 
    )
  }
};
