const { Model, DataTypes } = require('sequelize');

class Group extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            isPrivate: DataTypes.BOOLEAN,
            image: {
                type: DataTypes.STRING,
                get() {
                    return `http://localhost:3333/files/${this.getDataValue('avatar')}`;
                }
            },
            createdBy: DataTypes.STRING,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'creator'
        })

        this.belongsToMany(models.User, {
            foreignKey: 'group_id',
            through: 'user_groups',
            as: 'users'
        })
    }
}

module.exports = Group;