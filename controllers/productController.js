const Product = require("../models/Product");
const { FETCH_SUCCESS, SERVER_ERROR, CREATED_SUCCESS, DELETED_SUCCESS } = require("../messages");
const { HTTP_STATUS, USER_STATUS } = require("../constants");
const xlsx = require('xlsx');
const { parse } = require("csv-parse");
const fs = require("fs");


exports.getAllProducts = async (req, res) => {
    try {
      const { category } = req.query;
      if (category) {
        const products = await Product.find({ category }).populate('images');
        console.log(products);
        res.status(HTTP_STATUS.OK).json({
          status: 'success',
          error: null,
          message: 'FETCH_SUCCESS',
          result: products,
        });
      } else {
        const products = await Product.find({}).populate('name');
  
        res.status(HTTP_STATUS.OK).json({
          status: 'success',
          error: null,
          message: 'FETCH_SUCCESS',
          result: products,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        error: {
          status: true,
          message: 'SERVER_ERROR',
        },
        message: 'SERVER_ERROR',
        result: null,
      });
    }
  };



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
        if (!req.file) {
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

        const file = req.file;
        await fs.createReadStream(file.path)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", async (row) => {
                const [ name,display_name,category,status,code,selling_price,original_price,discount ] = row;
                if(name !== "") {
                    await new Product({
                        name, 
                        display_name,
                        category,
                        status,
                        code,
                        selling_price,
                        original_price,
                        discount
                    }).save();
                }
            })
            .on("end", async () => {
                res.status(HTTP_STATUS.CREATED).json({
                    status: "success",
                    error: null,
                    message: "Bulk product upload successful",
                    result: null
                });
            })
            .on("error", function (error) {
                console.log(error.message);
                res.status(HTTP_STATUS.INTERNAL_SERVER).json({
                    status: "error",
                    error: {
                        status: true,
                        message: SERVER_ERROR,
                    },
                    message: SERVER_ERROR,
                    result: null
                });
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
exports.getProductsByCategory = async (req, res) => {
    try {
      const { category } = req.query; 
  
      
      const products = await Product.find({ category });
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };