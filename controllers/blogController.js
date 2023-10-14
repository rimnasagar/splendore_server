const Blog = require("../models/Blog");
const { FETCH_SUCCESS, SERVER_ERROR, CREATED_SUCCESS, DELETED_SUCCESS } = require("../messages");
const { HTTP_STATUS, USER_STATUS } = require("../constants");

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: FETCH_SUCCESS,
            result: blogs
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
        const blog = await new Blog({
            ...data
        }).save();;
        res.status(HTTP_STATUS.CREATED).json({
            status: "success",
            error: null,
            message: CREATED_SUCCESS,
            result: blog
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

exports.getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: FETCH_SUCCESS,
            result: blog
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
        const blog = await Blog.findByIdAndDelete(id);
        
        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: DELETED_SUCCESS,
            result: blog
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