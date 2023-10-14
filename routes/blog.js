const routes = require('express').Router();
const BlogController = require("../controllers/blogController");


routes.get('/', BlogController.getAllBlogs);
routes.get('/:id', BlogController.getBlog);
routes.post('/', BlogController.store);
routes.delete('/:id', BlogController.delete);

module.exports = routes;