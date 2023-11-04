'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      commentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'postid'
        },
        //외래키와 관련된 행이 업데이트 되거나 삭제될때의 동작 지정
        //CASCADE : 부모 테이블의 변경 사항을 자동으로 자식 테이블에 반영
        //SET NULL : 부모 테이블의 행이 삭제될 때 외래 키 값을 NULL로 설정
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      writer: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};