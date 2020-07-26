const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;

const User = require('../models/User');
const Session = require('../models/Session');
const generateToken = require('../util/generateToken');
const response = require('../util/response');

module.exports = {
  async show(req, res) {
    try {
      const { loginemail: login, loginemail: email, password } = req.headers;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ login }, { email }]
        }
      });

      if (!user) {
        return res
          .status(400)
          .send(
            response(null, 'Nenhum usuário encontrado com este login ou email')
          );
      }

      const session = await Session.findOne({
        where: {
          user_id: user.id
        }
      });

      if (session) {
        const { io } = req;
        console.log(session.socketId);
        io.to(session.socketId).emit('logout');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        user.password = undefined;
        return res
          .status(400)
          .send(
            response(
              user,
              `${user.firstname} vc esqueceu a senha? A senha que vc passou não é a mesma que vc tinha cadastado.`
            )
          );
      }

      user.password = undefined;

      res.status(200).send(
        response({
          user,
          token: generateToken({ id: user.id })
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send(
          response(error, 'Opa!!! Aconteceu algum problema na autentificação')
        );
    }
  }
};
