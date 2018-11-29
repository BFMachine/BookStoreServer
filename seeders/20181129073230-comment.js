'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Comments", [
      {
        content: "Первый коммент",
        commenter_name: "Вася",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        user_id: 2
      },
      {
        content: "Второй коммент",
        commenter_name: "Петр Петрович",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        user_id: 2
       },
      {
        content: "Третий коммент",
        commenter_name: "Инкогнито",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        user_id: 2
      },
      {
        content: "Четвертый коммент",
        commenter_name: "unknown",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        user_id: 2
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Comments", null, {});
  }
};
