const Product = require("../models/Product");
const { FETCH_SUCCESS, SERVER_ERROR, CREATED_SUCCESS, DELETED_SUCCESS } = require("../messages");
const { HTTP_STATUS, USER_STATUS } = require("../constants");
const xlsx = require('xlsx');


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: FETCH_SUCCESS,
            result: products
        });
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null
        })
    }
}

exports.store = async (req, res) => {
    try {
        const data = req.body;
        const product = await new Product({
            ...data
        }).save();;
        res.status(HTTP_STATUS.CREATED).json({
            status: "success",
            error: null,
            message: CREATED_SUCCESS,
            result: product
        });
    } catch (err) {
        console.log(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null
        })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: FETCH_SUCCESS,
            result: product
        })
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null
        })
    }
}


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: DELETED_SUCCESS,
            result: product
        })
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null
        })
    }
}

exports.storeBulkProducts = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "error",
                error: {
                    status: true,
                    message: "File not provided",
                },
                message: "File not provided",
                result: null
            });
        }

        const file = req.files.file; // Assuming you're using a file upload middleware like `multer`

        const workbook = xlsx.read(file.data, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const products = xlsx.utils.sheet_to_json(worksheet);

        for (const product of products) {
            // Validate and insert the product data into the database
            await new Product(product).save();
        }

        res.status(HTTP_STATUS.CREATED).json({
            status: "success",
            error: null,
            message: "Bulk product upload successful",
            result: null
        });
    } catch (err) {
        console.log(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null
        });
    }
}