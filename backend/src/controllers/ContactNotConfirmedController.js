const Sequelize = require('sequelize');

const User = require('../models/User');
const Contact = require('../models/Contact');
const response = require('../util/response');
const Op = Sequelize.Op;

module.exports = {
  async index(req, res) {
    try {
      const { user_id } = req.params;
      const { search = '' } = req.query;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).send(response(null, 'Usuário não encontrado'));
      }

      const contacts = await Contact.findAll({
        attributes: ['id', 'confirmed', 'createdAt', 'updatedAt'],
        where: {
          user_id,
          [Op.or]: [{ confirmed: false }, { confirmed: { [Op.is]: null } }]
        },
        include: {
          association: 'user',
          where: {
            firstname: { [Op.iLike]: `%${search}%` }
          }
        },
        order: [['user', 'firstname']]
      });

      return res.status(200).send(response(contacts));
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          response(
            error,
            'Opa!!! Aconteceu algum problema ao tentar encontrar os contatos!!!'
          )
        );
    }
  }
};
