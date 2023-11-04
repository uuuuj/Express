'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Comments', 'writer');
    await queryInterface.addColumn('Comments', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'userId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Comments', 'writer', {
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn('Comments', 'userId');
  }
};
