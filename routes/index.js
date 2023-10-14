const routes = require('express').Router();
const AuthController = require("../controllers/auth/authController");

routes.post('/auth/login', AuthController.login);
routes.post('/auth/register', AuthController.register);

routes.get('/health', (req, res) => {
  res.status(200).json({"status" : "ok"});
});

module.exports = routes;