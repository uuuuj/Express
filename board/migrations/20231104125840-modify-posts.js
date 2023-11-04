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
    await queryInterface.removeColumn('Posts', 'writer');
    await queryInterface.addColumn('Posts', 'userId', {
      type: Sequelize.INTEGER,
      references:{
        model: 'Users',
        key: 'userId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  //migration을 되돌리고자 할때(예를 들어, 새로운 변경 사항에 문제가 있어 이전 버전으로 롤백해야할 때),
  //db:migration:undo 커맨드를 사용하면 down 함수가 호출된다.
  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Posts', 'writer', {
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn('Posts', 'userId');
  }
};
