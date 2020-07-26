const { Model, DataTypes } = require('sequelize');

class Session extends Model {
    static init(sequelize) {
        super.init({
            userId: DataTypes.BIGINT,
            socketId: DataTypes.STRING
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        })
    }
}

module.exports = Session;