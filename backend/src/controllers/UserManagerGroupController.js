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

            const groups = await Group.findAll({
                where: {
                    createdBy: user_id,
                    name: { [Op.iLike]: `%${search}%` }
                }
            })

            return res.status(200).send(response(groups));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar encontrar os grupos!!!"));
        }
    },
    async store(req, res) {
        try {
            const { user_id } = req.params;
            const { name, isPrivate } = req.body;

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).send(response(null, "Usuário não encontrado"))
            }

            const [group, created] = await Group.findOrCreate({
                where: {
                    createdBy: user_id,
                    name,
                },
                defaults: {
                    isPrivate
                }
            });

            if (!created) {
                return res.status(400).send(response(null, "Grupo já cadastrado"))
            }

            await group.addUser(user);

            return res.status(200).send(response(group));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar cadastrar o grupo"));
        }
    },
    async update(req, res) {
        try {
            const { user_id, group_id } = req.params;
            const { name } = req.body;

            await Group.update({
                name
            }, {
                where: {
                    id: group_id,
                    createdBy: user_id
                }
            })

            return res.status(200).send(response(null, "Grupo renomeado com sucesso"));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar alterar esse grupo"));
        }
    },
    async destroy(req, res) {
        try {
            const { user_id, group_id } = req.params;

            await Group.destroy({
                where: {
                    id: group_id,
                    createdBy: user_id
                }
            })

            return res.status(200).send(response(null, "Grupo excluido com sucesso"));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar apagar esse grupo"));
        }
    }
};