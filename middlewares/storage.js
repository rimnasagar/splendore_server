const multer = require('multer');
const fs = require('fs');
const { uuid } = require("uuidv4");

const { STORAGE_DIR } = require("../config");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(STORAGE_DIR)){
            fs.mkdirSync(STORAGE_DIR);
        }
        cb(null, STORAGE_DIR);
    },
    filename: (req, file, cb) => {
        console.log("file ", file)
        const type = file.originalname.split(".");
        const fileName =  `${uuid()}.${type[type.length - 1]}`;
        cb(null, fileName)
    }
});

exports.upload = multer({
    storage: storage,
    onError : function(err, next) {
        console.log('error', err);
        //next(err);
    },
    fileFilter: (req, file, cb) => {
        //if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        //} else {
        //    cb(null, false);
        //    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        //}
    }
});