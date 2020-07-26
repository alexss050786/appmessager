const { Model, DataTypes } = require('sequelize');

class Message extends Model {
  static init(sequelize) {
    super.init({
      from: DataTypes.INTEGER,
      to: DataTypes.INTEGER,
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Digite uma mensagem"
          }
        }
      }
    }, { sequelize })
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'from',
      as: 'userFrom'
    })

    this.belongsTo(models.User, {
      foreignKey: 'to',
      as: 'userTo'
    })
  }
}

module.exports = Message;