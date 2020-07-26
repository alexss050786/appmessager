const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const authMiddleware = require('./middlewares/auth');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const ContactController = require('./controllers/ContactController');
const ContactNotConfirmedController = require('./controllers/ContactNotConfirmedController');
const UserGroupController = require('./controllers/UserGroupController');
const UserManagerGroupController = require('./controllers/UserManagerGroupController');
const GroupController = require('./controllers/GroupController');
const MessageController = require('./controllers/MessageController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Requisições sem Token
//Auth
routes.post('/auth', AuthController.show);

//Usuario
routes.post('/users', upload.single('avatar'), UserController.store);

//Requisições com Token
routes.use(authMiddleware);

//Usuario
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', upload.single('avatar'), UserController.update);
routes.delete('/users/:id', UserController.destroy);

//Contato
routes.post('/users/:user_id/contacts', ContactController.store);
routes.get('/users/:user_id/contacts', ContactController.index);
routes.get('/users/:user_id/contacts/:contact_id', ContactController.show);
routes.put('/users/:user_id/contacts/:contact_id', ContactController.update);
routes.delete(
  '/users/:user_id/contacts/:contact_id',
  ContactController.destroy
);

//Contatos não confirmados
routes.get(
  '/users/:user_id/contactsnotconfirmed',
  ContactNotConfirmedController.index
);

//Usuario Gerenciador do Grupo //Gerenciamento de Grupos do Usuario
routes.get('/users/:user_id/manager-groups', UserManagerGroupController.index);
routes.post('/users/:user_id/manager-groups', UserManagerGroupController.store);
routes.put(
  '/users/:user_id/manager-groups/:group_id',
  UserManagerGroupController.update
);
routes.delete(
  '/users/:user_id/manager-groups/:group_id',
  UserManagerGroupController.destroy
);

//Usuarios e Grupos //Gerenciamento de Grupos dos Usuarios
routes.get('/users/:user_id/groups', UserGroupController.index);
routes.post('/users/:user_id/groups/:group_id', UserGroupController.store);
routes.delete('/users/:user_id/groups/:group_id', UserGroupController.destroy);

//Grupos
routes.get('/groups', GroupController.index);
routes.get('/groups/:group_id', GroupController.show);

//Mensagens
routes.post('/users/:from/messages/:to', MessageController.store);
routes.get('/users/:from/messages/:to', MessageController.index);

//Session
routes.delete('/users/:user_id/session', SessionController.destroy);

module.exports = routes;
