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
        attributes: ['id', 'createdAt', 'updatedAt'],
        where: {
          user_id,
          confirmed: true
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
  },
  async store(req, res) {
    try {
      const { user_id } = req.params;
      const { loginEmailContact } = req.body;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).send(response(null, 'Usuário não encontrado'));
      }

      const userContact = await User.findOne({
        include: { association: 'session' },
        where: {
          [Op.or]: [{ login: loginEmailContact }, { email: loginEmailContact }]
        }
      });

      if (!userContact) {
        return res.status(400).send(response(null, 'Contato não encontado'));
      }

      if (user_id == userContact.id) {
        return res
          .status(400)
          .send(
            response(
              null,
              'Você esta tentando adicionar seu próprio contato!!!'
            )
          );
      }

      const contactExists = await Contact.findOne({
        where: {
          user_id,
          user_contact_id: userContact.id
        }
      });

      if (contactExists) {
        if (!contactExists.confirmed) {
          return res
            .status(400)
            .send(
              response(
                null,
                `O Contato ${loginEmailContact} já esta cadastrado, aguardando confirmação.`
              )
            );
        }
        return res
          .status(400)
          .send(
            response(null, `O Contato ${loginEmailContact} já esta cadastrado.`)
          );
      }

      await Contact.create({
        user_id,
        user_contact_id: userContact.id,
        confirmed: null
      });

      await Contact.create({
        user_id: userContact.id,
        user_contact_id: user_id
      });

      if (userContact.session) {
        const { io } = req;
        io.to(userContact.session.socketId).emit(
          'newcontact',
          response(
            user,
            `${user.firstname} gostaria de adicionar seu contato na lista de contatos dele. Você Aceita?`
          )
        );
      }

      return res.status(200).send(
        response(
          null,
          `O Contato foi cadastrado com sucesso!!!
            Porém é necessário que o contato ${loginEmailContact} (${userContact.firstname})
            confirme seu contato. Aguarde a confirmação.`
        )
      );
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          response(
            error,
            'Opa!!! Aconteceu algum problema ao tentar cadastrar o contato'
          )
        );
    }
  },
  async show(req, res) {
    try {
      const { user_id, contact_id } = req.params;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).send(response(null, 'Usuário não encontrado'));
      }

      const contact = await Contact.findOne({
        attributes: ['createdAt', 'updatedAt'],
        where: {
          user_id,
          user_contact_id: contact_id,
          confirmed: true
        },
        include: {
          association: 'user'
        }
      });

      if (!contact) {
        return res.status(200).send(response(null, 'Contato não encontrado'));
      }

      return res.status(200).send(response(contact));
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          response(
            error,
            'Opa!!! Aconteceu algum problema ao tentar encontrar esse contato'
          )
        );
    }
  },
  async update(req, res) {
    try {
      const { user_id, contact_id } = req.params;
      const { confirmed } = req.body;

      const user = await User.findByPk(user_id, {
        include: { association: 'session' }
      });

      if (!user) {
        return res.status(400).send(response(null, 'Usuário não encontrado'));
      }

      await Contact.update(
        {
          confirmed
        },
        {
          where: {
            [Op.or]: [
              {
                user_id,
                user_contact_id: contact_id
              },
              {
                user_id: contact_id,
                user_contact_id: user_id
              }
            ]
          }
        }
      );

      if (confirmed) {
        const { io } = req;
        const userContact = await User.findByPk(contact_id, {
          include: { association: 'session' }
        });
        if (userContact.session) {
          const newContact = await Contact.findOne({
            attributes: ['id', 'createdAt', 'updatedAt'],
            where: {
              user_id: contact_id,
              user_contact_id: user_id,
              confirmed: true
            },
            include: {
              association: 'user'
            }
          });

          io.to(userContact.session.socketId).emit(
            'newcontactconfirmed',
            response(newContact, `${user.firstname} confirmou o seu contato.`)
          );
        }

        const contact = await Contact.findOne({
          attributes: ['id', 'createdAt', 'updatedAt'],
          where: {
            user_id,
            user_contact_id: contact_id,
            confirmed: true
          },
          include: {
            association: 'user'
          }
        });

        io.to(user.session.socketId).emit(
          'newcontactconfirmed',
          response(contact, 'Confirmado com Sucesso')
        );
      }

      res.status(200).send();
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          response(
            error,
            'Opa!!! Aconteceu algum problema ao tentar alterar esse contato'
          )
        );
    }
  },
  async destroy(req, res) {
    try {
      const { user_id, contact_id } = req.params;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).send(response(null, 'Usuário não encontrado'));
      }

      const contact = await Contact.findOne({
        where: {
          user_id,
          user_contact_id: contact_id
        }
      });

      if (!contact) {
        return res.status(400).send(response(null, 'Contato não encontrado'));
      }

      Contact.destroy({
        where: {
          [Op.or]: [
            {
              user_id,
              user_contact_id: contact_id
            },
            {
              user_id: contact_id,
              user_contact_id: user_id
            }
          ]
        }
      });

      if (!contact.confirmed) {
        const userContact = await User.findByPk(contact_id, {
          include: { association: 'session' }
        });
        console.log(userContact.session.socketId);
        const { io } = req;
        io.to(userContact.session.socketId).emit(
          'newcontactnotconfirmed',
          response(null, `${user.firstname} não aceitou adicionar seu contato.`)
        );
      }

      res.status(200).send();
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(
          response(
            error,
            'Opa!!! Aconteceu algum problema ao tentar apagar esse contato'
          )
        );
    }
  }
};
