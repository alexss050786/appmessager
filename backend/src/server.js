const express = require('express');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Session = require('./models/Session');

require('./database');

io.on('connection', socket => {
  const { userId } = socket.handshake.query;
  const socketId = socket.id;

  console.log(userId, socketId);
  async function initSession() {
    const [session, created] = await Session.findOrCreate({
      where: {
        userId
      },
      defaults: {
        socketId
      }
    });

    if (!created) {
      await Session.update(
        {
          socketId
        },
        {
          where: {
            id: session.id
          }
        }
      );
    }
  }

  initSession();
});

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
