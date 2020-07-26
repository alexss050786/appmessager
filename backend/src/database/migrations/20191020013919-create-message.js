'use strict';

module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize.createTable('messages', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      from: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL'
      },
      to: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL'
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
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
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('messages');
  }
};
