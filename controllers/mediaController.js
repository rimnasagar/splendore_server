const Media = require("../models/Media");
const Ticket = require("../models/Ticket");
const fs = require("fs");
const { uuid } = require("uuidv4");
const { HTTP_STATUS } = require("../constants");
const { serverError } = require("../services/errorHandler");
const { STORAGE_DIR } = require("../config");
const path = require("path");

exports.store = async (req, res) => {
    try {
        const { ticketCode } = req.body;
        const url = req.protocol + '://' + req.get('host')
        const { filename, originalname, mimetype , fieldname, size} = req.file;
        const ext = mimetype.split("/");
        const file = {
            name: filename,
            actual_name: originalname,
            type: fieldname,
            url: `${url}/${fieldname}/${filename}`,
            extension: ext[1],
            hash: uuid(),
            mime_type: mimetype,
            size: size,
        };
        const media = new Media(file);
        const data = await media.save();

        const ticket = await Ticket.updateOne({code: ticketCode}, {$push: {attachments: data._id }}, {upsert:true});
        
        res.status(200).json({ file: ticket });
        
    } catch(err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
};

exports.delete = async (req, res) => {
    try {
        let { code, id} = req.params;
        const media = await Media.findByIdAndRemove({_id: id});
        
        await unLinkFile(media.name);
        if(media) {
            const ticket = await Ticket.updateOne({code}, {$pullAll: {attachments: [{_id: id}] }});
            if(ticket)
                res.status(200).json({
                    status: "success",
                    error: false,
                    message: "Successfully deleted",
                    result: ticket,
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
                    message: "Successfully deleted",
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
            if (fs.existsSync(item.url)) {
                fs.readFile(item.url, function (err, content) {
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