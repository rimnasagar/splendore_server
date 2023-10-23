const routes = require('express').Router();
const Media = require("../controllers/mediaController");
const storage = require("../middlewares/storage");


routes.post('/:productId', storage.upload.single('file'), Media.store);
routes.delete('/:id', Media.delete);
routes.get('/download/:id', Media.download);
routes.get('/show/:id', Media.show);
routes.get('/all', Media.all);
// routes.get('/:productId',Media.getProductImages)

module.exports = routes;
