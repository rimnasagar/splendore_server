const routes = require('express').Router();
const ProductController = require("../controllers/productController");


routes.get('/', ProductController.getAllProducts);
routes.get('/:id', ProductController.getProduct);
routes.post('/', ProductController.store);
routes.delete('/:id', ProductController.delete);

module.exports = routes;