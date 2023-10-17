const Media = require("../models/Media");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { HTTP_STATUS } = require("../constants");
const { serverError } = require("../services/errorHandler");
const { STORAGE_DIR } = require("../config");
const path = require("path");

exports.store = async (req, res) => {
    try {
        console.log(req.file)
        const url = req.protocol + '://' + req.get('host')
        const { filename, originalname, mimetype , fieldname, size} = req.file;
        const ext = mimetype.split("/");
        const file = {
            name: filename,
            actual_name: originalname,
            type: fieldname,
            url: `${url}/api/v1/media/show`,
            path: req.file.path,
            extension: ext[1],
            hash: uuid(),
            mime_type: mimetype,
            size: size,
        };
        const media = new Media(file);
        const data = await media.save();

        res.status(200).json({ file: data });
        
    } catch(err) {
        console.log(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
};

exports.delete = async (req, res) => {
    try {
        let { id } = req.params;
        const media = await Media.findByIdAndRemove({_id: id});
        await unLinkFile(media.name);
        if(media) {
            res.status(200).json({
                status: "success",
                error: false,
                message: "Successfully deleted",
                result: {},
            });
        }
    } catch(err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
    
};

exports.all = (req, res) => {
    Media.find()
        .then((item) => {
            if (item) {
                res.status(200).json({
                    status: "success",
                    error: false,
                    message: "Successfully fetched",
                    result: item,
                });
            }
        })
        .catch((err) => {
            console.log("delete err");
            res.status(400).send("error in saving");
        });
};

exports.download = (req, res) => {
    var _id = req.params.id ? req.params.id : null;
    Media.findById(_id)
        .then((item) => {
            const url = path.join(STORAGE_DIR, item.name)
            if (fs.existsSync(url)) {
                res.download(url, item.name, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({
                            message: "Could not download the file. " + err,
                        });
                    }
                });
            } else {
                console.log("not exisit");
            }
        })
        .catch((err) => {
            res.status(400).send("error in saving");
        });
};

exports.show = (req, res) => {
    var _id = req.params.id ? req.params.id : null;
    Media.findById(_id)
        .then((item) => {
            if (fs.existsSync(item.path)) {
                fs.readFile(item.path, function (err, content) {
                    if (err) {
                        res.writeHead(400, { 'Content-type': 'text/html' })
                        res.end("No such image");
                    } else {
                        res.writeHead(200, { 'Content-type': 'image/jpg' });
                        //res.write('Content-Length: 100');
                        res.end(content);
                    }
                });
            } else {
                console.log("not exisit");
                res.status(404).send("not found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("error fetching");
        });
}


const unLinkFile = (fileName) => {
        fs.unlink(path.join(STORAGE_DIR, fileName), (err) => {
        if (err) throw err;
    });
}