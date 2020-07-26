const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;

const User = require('../models/User');
const generateToken = require('../util/generateToken');
const response = require('../util/response');
const file = require('../util/file');

module.exports = {
    async index(req, res) {
        try {

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Opa!!! Aconteceu algum problema ao tentar encontrar os usuários!!!"));
        }
    },
    async store(req, res) {
        try {
            const { login, firstname, lastname, email, password, about } = req.body;
            let avatar = null;

            if (req.file) {
                const { filename } = req.file;
                avatar = filename;
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const [user, created] = await User.findOrCreate({
                where: {
                    [Op.or]: [
                        { login },
                        { email }
                    ]
                },
                defaults: {
                    login,
                    email,
                    password: passwordHash,
                    firstname,
                    lastname,
                    avatar,
                    about
                }
            });

            user.password = undefined;

            //se usuario ja existe(nao foi criado) e informou avatar, entao apago esse avatar
            if (!created && avatar) {
                file.destroy(avatar);
            };

            //Usuario ja cadastrado
            if (!created) {
                return res.status(400).send(response({
                    name: 'ValidationError',
                    errors: [{
                        message: "Desculpa, mas esse login ou email já esta sendo usado por outro usuário.",
                        path: "login"
                    }]
                }));
            }

            return res.status(200).send(response({
                user,
                token: generateToken({ id: user.id })
            }));
        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Opa!!! Aconteceu algum problema no seu cadastro!!!"));
        }
    },
    async show(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, {
                include: { association: 'session' }
            });

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"));
            };

            user.password = undefined;
            return res.status(200).send(response(user));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Opa!!! Aconteceu algum problema ao tentar encontrar esse usuário"));
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { login, email, firstname, lastname, about } = req.body;
            let { avatar } = req.body;

            if (req.file) {
                const { filename } = req.file;
                avatar = filename;
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            const userLoginExist = await User.findOne({
                where: {
                    login
                }
            })

            //Usuario ja cadastrado
            if (userLoginExist && user.login != userLoginExist.login) {
                if (avatar) {
                    file.destroy(avatar)
                }
                return res.status(400).send(response(null, "Desculpa, mas esse login já esta sendo usado por outro usuário."));
            }

            const userEmailExist = await User.findOne({
                where: {
                    email
                },
            })

            //Usuario ja cadastrado
            if (userEmailExist && user.email != userEmailExist.email) {
                if (avatar) {
                    file.destroy(avatar)
                }
                return res.status(400).send(response(null, "Desculpa, mas esse email já esta sendo usado por outro usuário."));
            }

            // Deletando o arquivo antigo
            const avatarOld = user.getDataValue('avatar');
            if (avatarOld) {
                file.destroy(avatarOld);
            }

            await User.update({
                login,
                email,
                firstname,
                lastname,
                avatar,
                about
            }, {
                where: {
                    id
                }
            });

            const userUpdated = await User.findByPk(id);
            userUpdated.password = undefined;

            return res.status(200).send(response({user:userUpdated}, "Alterado com sucesso"));
        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Opa!!! Aconteceu algum problema ao tentar alterar o seus dados!!!"));
        }
    },
    async destroy(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            await User.destroy({
                where: {
                    id
                }
            })

            // Deletando o arquivo antigo
            const avatar = user.getDataValue('avatar');
            if (avatar) {
                file.destroy(avatar);
            }

            return res.status(200).send(response(null, "Todos os seus dados foram apagados com sucesso"));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Opa!!! Aconteceu algum problema ao tentar apagar os seus dados!!!"));
        }
    }
};
