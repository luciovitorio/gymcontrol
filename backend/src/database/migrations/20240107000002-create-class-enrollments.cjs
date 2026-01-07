"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("class_enrollments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "classes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      enrolled_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      status: {
        type: Sequelize.ENUM("confirmed", "cancelled", "no_show"),
        allowNull: false,
        defaultValue: "confirmed",
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Índices
    await queryInterface.addIndex("class_enrollments", ["class_id"]);
    await queryInterface.addIndex("class_enrollments", ["user_id"]);
    await queryInterface.addIndex("class_enrollments", ["status"]);

    // Índice único para evitar inscrições duplicadas na mesma aula
    await queryInterface.addIndex(
      "class_enrollments",
      ["class_id", "user_id"],
      {
        unique: true,
        name: "unique_active_enrollment",
        where: {
          status: "confirmed",
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("class_enrollments");
  },
};
