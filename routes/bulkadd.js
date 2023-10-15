const routes = require('express').Router();
const os = require("os");
const ProductController = require("../controllers/productController");
const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() })

routes.get('/', ProductController.getAllProducts);
routes.get('/:id', ProductController.getProduct);
routes.post('/', upload.single('file'), ProductController.storeBulkProducts );
routes.delete('/:id', ProductController.delete);

module.exports = routes;