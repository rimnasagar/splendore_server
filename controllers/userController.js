const { HTTP_STATUS, USER_STATUS, CHANNEL } = require("../constants");
const { FETCH_SUCCESS, SERVER_ERROR } = require("../messages");
const User = require("../models/User");
const { serverError } = require("../services/errorHandler");
const SocketService = require("../services/socketService");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "firstname lastname display_name email role status");
        res.status(HTTP_STATUS.OK).json({
            status: "success",
            error: null,
            message: FETCH_SUCCESS,
            result: users
        })
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

exports.statusChange = async (req, res) => {
    try {
        const { id, status, role } = req.body;
        const options = {};
        if(status) {
            let STATUS = USER_STATUS.APPROVED
            if (status === "approve" ) {
                STATUS = USER_STATUS.APPROVED
            } else if (status === "block") {
                STATUS = USER_STATUS.BLOCK
            }
            Object.assign(options, {status: STATUS})
        }
        if(role) {
            Object.assign(options, {role})
        }
        
        const user = await User.findByIdAndUpdate(id, options);
        if(user) {
            res.status(HTTP_STATUS.OK).json({
                status: "success",
                error: {
                    status: true,
                    message: FETCH_SUCCESS,
                },
                message: FETCH_SUCCESS,
                result: user
            })
        }
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
}

exports.getLoginUser = async (req, res) => {
    try {
        const { user } = req;
        const userData = await User.findById(user._id,  "firstname lastname display_name email role status");
        if(userData) {
            res.status(HTTP_STATUS.OK).json({
                status: "error",
                error: null,
                message: FETCH_SUCCESS,
                result: userData
            })
        }

    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
}