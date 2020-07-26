const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            login: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [4, 20],
                        msg: "O login precisa ter entre 4 e 20 caracteres"
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: {
                        msg: "O Email informado é inválido"
                    }
                }
            },
            password: DataTypes.STRING,
            firstname: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [4, 60],
                        msg: "O nome precisa ter entre 2 e 60 caracteres"
                    }
                }
            },
            lastname: {
                type: DataTypes.STRING,
                validate: {
                    max: {
                        args: [60],
                        msg: "O sobrenome precisa ter no máximo 60 caracteres"
                    }
                }
            },
            avatar: {
                type: DataTypes.STRING,
                get() {
                    if (this.getDataValue('avatar')) {
                        return `http://localhost:3333/files/${this.getDataValue('avatar')}`;
                    }
                    return null;
                }
            },
            about: DataTypes.STRING
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasOne(models.Session, {
            foreignKey: 'user_id',
            as: 'session'
        })

        this.hasMany(models.Contact, {
            foreignKey: 'user_id',
            as: 'contacts'
        })

        this.belongsToMany(models.Group, {
            foreignKey: 'user_id',
            through: 'user_groups',
            as: 'groups'
        })
    }
}

module.exports = User;