const routes = require('express').Router();
const UserController = require("../controllers/userController");

routes.get('/', UserController.getAllUsers);
routes.put('/status', UserController.statusChange);
routes.get('/refresh', UserController.getLoginUser);

module.exports = routes;