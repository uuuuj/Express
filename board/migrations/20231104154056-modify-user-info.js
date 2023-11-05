'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.renameColumn('UserInfos', 'id', 'userinfoId');

    await queryInterface.removeColumn('UserInfos', 'UserId');

    await queryInterface.addColumn('UserInfos', 'userId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      unique: true,
      references: {
        model: 'Users',
        key: 'userId'
      },
    });

    await queryInterface.changeColumn('UserInfos', 'name', {
      allowNull: false,
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('UserInfos', 'createdAt', {
      allowNull: false, // NOT NULL
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.changeColumn('UserInfos', 'updatedAt', {
      allowNull: false, // NOT NULL
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
