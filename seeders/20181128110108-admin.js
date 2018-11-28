'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert("Users", [
      {
        email: "admin",
        pass_hash: "111",
        role: "admin",
        full_name: "Иванов Иван Иванович",
        address: "г.Таганрог, ул.Петровская, д.1",
        phone: "+7(999)999-99-99",
        ref_token: "",
      },
      {
        email: "reader",
        pass_hash: "111",
        role: "user",
        full_name: "Петров Петр Петрович",
        address: "г.Таганрог, ул.Петровская, д.2",
        phone: "+7(111)111-11-11",
        ref_token: "",
      },
      {
        email: "aaa@gmail.com",
        pass_hash: "111",
        role: "disabled",
        full_name: "Сидоров Сидор Сидорович",
        address: "г.Таганрог, ул.Петровская, д.3",
        phone: "+7(555)555-55-55",
        ref_token: "",
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
