'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Files", [
      {
        name: "file_1",
        type: "cover",
        book_id: 3,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        name: "file_2",
        type: "cover",
        book_id: 3,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')

      },
    ], {});
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Files", null, {});
  }
};
