const { Model, DataTypes } = require('sequelize');

class Contact extends Model {
  static init(sequelize) {
    super.init({
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'onwer'
    })

    this.belongsTo(models.User, {
      foreignKey: 'user_contact_id',
      as: 'user'
    })

  }
}

module.exports = Contact;