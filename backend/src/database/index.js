const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Contact = require('../models/Contact');
const Group = require('../models/Group');
const Session = require('../models/Session')
const Message = require('../models/Message');

const connection = new Sequelize(dbConfig);

User.init(connection);
Contact.init(connection);
Group.init(connection);
Session.init(connection);
Message.init(connection);

const models = connection.models;
User.associate(models);
Contact.associate(models);
Group.associate(models);
Session.associate(models);
Message.associate(models);

module.exports = connection;