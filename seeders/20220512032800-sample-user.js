"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        name: "Taro",
        pass: "yamada",
        mail: "taro@mail.com",
        age: 39,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hanako",
        pass: "hanahana",
        mail: "hanako@mail.com",
        age: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jiro",
        pass: "jirojiro",
        mail: "jiro@mail.com",
        age: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sachiko",
        pass: "sachi",
        mail: "sachiko@mail.com",
        age: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", null, {});
  },
};
