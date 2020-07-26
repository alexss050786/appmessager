const Op = require('sequelize').Op;

const User = require('../models/User');
const Message = require('../models/Message');
const Group = require('../models/Group');
const response = require('../util/response');

module.exports = {
  async store(req, res) {
    try {
      const { from, groupId } = req.params;
      const { message } = req.body;

      const group = Group.findByPk(groupId,{
        include: {association: 'users'}
      })

      const io = req.io;
      const userFrom = await User.findByPk(from, {
        include: { association: 'session' }
      });

      group.users.map(user => {
        const to = user.id;
        const newMessage = await Message.create({
          from,
          to,
          message
        });

        const userTo = await User.findByPk(to, {
          include: { association: 'session' }
        });


        if (userTo.session) {
          io.to(userTo.session.socketId).emit(
            'newmessage',
            response({
              userFrom,
              newMessage
            })
          );
        }

      });

      return res.status(200).send(response(newMessage));
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send(response(error, 'Falha ao enviar a mensagem!!!'));
    }
  }
};
