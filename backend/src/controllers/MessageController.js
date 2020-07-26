const Op = require('sequelize').Op;

const User = require('../models/User');
const Message = require('../models/Message');
const response = require('../util/response');


module.exports = {
    async index(req, res) {
        try {
            const { from, to } = req.params;
            const { search = "" } = req.query;

            console.log(from, to)

            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        {
                            from,
                            to
                        },
                        {
                            from: to,
                            to: from
                        }
                    ],
                    message: { [Op.iLike]: `%${search}%` }
                }
            });

            return res.status(200).send(response(messages));
        } catch (error) {
            console.log(error);
            return res.status(400).send(response(error, "Falha ao Carregar as Mensagens!!!"));
        }
    },
    async store(req, res) {
        try {
            const { from, to } = req.params;
            const { message } = req.body;

            const newMessage = await Message.create({
                from,
                to,
                message
            });

            const userFrom = await User.findByPk(from, {
                include: { association: 'session' }
            });
            const userTo = await User.findByPk(to, {
                include: { association: 'session' }
            });

            const io = req.io;

            if (userTo.session) {
                io.to(userTo.session.socketId).emit('newmessage', response({
                    userFrom,
                    newMessage
                }))
            }

            return res.status(200).send(response(newMessage));

        } catch (error) {
            console.log(error)
            return res.status(400).send(response(error, "Falha ao enviar a mensagem!!!"));
        }
    }
}