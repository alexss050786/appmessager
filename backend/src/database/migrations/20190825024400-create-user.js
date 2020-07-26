'use strict';
/*
up, que é a função que indica o que modificar no banco de dados quando executarmos a migration e 
down, que funciona como um rollback, ou seja, tudo que for feito na up deve ser desfeito na down.
*/
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      login: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      lastname: DataTypes.STRING(60),
      avatar: {
        type: DataTypes.STRING,
      },
      about: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  }
};