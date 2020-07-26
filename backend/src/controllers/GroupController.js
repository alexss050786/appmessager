const { Op } = require('sequelize');

const Group = require('../models/Group');
const response = require('../util/response');

module.exports = {
    async index(req, res) {
        try {
            const { search = "" } = req.query;

            const groups = await Group.findAll({
                include: {
                    association: 'creator',
                },
                where: {
                    name: { [Op.iLike]: `%${search}%` }
                },
                order: [
                    ['name']
                ]
            });

            return res.status(200).send(response(groups));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar listar os grupos"));
        }
    },
    async show(req, res) {
        try {
            const { group_id } = req.params;
            const { search = "" } = req.query;

            const group = await Group.findByPk(group_id, {
                include: {
                    association: 'users',
                    through: { attributes: [] },
                    where: {
                        firstname: { [Op.iLike]: `${search}%` }
                    },
                    required: false
                },
                order: [
                    ['users', 'firstname']
                ]
            });

            if (!group) {
                return res.status(400).send(response(null, "Grupo não encontrado"))
            }

            return res.status(200).send(response(group));

        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Aconteceu algum problema ao tentar encontrar esse grupo"));
        }
    }
};