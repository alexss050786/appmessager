const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/User');
const Group = require('../models/Group');

const response = require('../util/response');

module.exports = {
    async index(req, res) {
        try {
            const { user_id } = req.params;
            const { search = "" } = req.query;

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            const groups = await user.getGroups({
                joinTableAttributes: [],
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                order: [
                    ['name']
                ]
            });

            return res.status(200).send(response(groups));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar encontrar os grupos!!!"));
        }
    },
    async store(req, res) {
        try {
            const { group_id, user_id } = req.params;
            const { creatorid, password } = req.headers;

            const group = await Group.findByPk(group_id);

            if (!group) {
                return res.status(400).send(response(null, "Grupo não encontrado"))
            }

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            if (await group.hasUser(user)) {
                return res.status(400).send(response(null, "Usuário já cadastrado no grupo"))
            }

            if (group.isPrivate) {
                if (creatorid != group.createdBy) {
                    return res.status(400).send(response(null, "Você não é o criador do grupo"))
                }

                const creator = await User.findByPk(creatorid);
                if (await bcrypt.compare(password, creator.password)) {
                    await group.addUser(user);
                    return res.status(200).send(response(null, "Usuário foi cadastrado no grupo privado com sucesso"));
                }

                return res.status(400).send(response(null, "Não é possível cadastrar o usuário no grupo privado, sem as credenciais do criador do grupo"));
            }

            await group.addUser(user);

            return res.status(200).send(response(null, "Usuário foi cadastrado no grupo com sucesso"));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar cadastrar o usuário no grupo"));
        }
    },
    async destroy(req, res) {
        try {
            const { group_id, user_id } = req.params;
            const { creatorid, password } = req.headers;

            const group = await Group.findByPk(group_id);

            if (!group) {
                return res.status(400).send(response(null, "Grupo não encontrado"))
            }

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            if (user.id === group.createdBy) {
                return res.status(400).send(response(null, "Não é possível remover o usuário que criou o grupo"))
            }

            if (!await group.hasUser(user)) {
                return res.status(400).send(response(null, "Usuário não encontrado no grupo"))
            }

            if (group.isPrivate) {
                if (creatorid != group.createdBy) {
                    return res.status(400).send(response(null, "Você não é o criador do grupo"))
                }

                const creator = await User.findByPk(creatorid);
                if (await bcrypt.compare(password, creator.password)) {
                    await group.removeUser(user);
                    return res.status(200).send(response(null, "Usuário foi removido do grupo privado com sucesso"));
                }

                return res.status(400).send(response(null, "Não é possível remover o usuário do grupo privado, sem as credenciais do criador do grupo"));
            }

            await group.removeUser(user);

            return res.status(200).send(response(null, "Usuário removido do grupo com sucesso"))

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar apagar o usuário do grupo"));
        }
    }
};