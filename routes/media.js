const routes = require('express').Router();
const Media = require("../controllers/mediaController");
const storage = require("../middlewares/storage");


routes.post('/', storage.upload.single('attachments'), Media.store);
routes.delete('/:code/:id', Media.delete);
routes.get('/download/:id', Media.download);
routes.get('/show/:id', Media.show);

module.exports = routes;
