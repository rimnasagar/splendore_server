const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
const { ACCESS_TOKEN_SECRET } = require("../config");
const { serverError } = require("../services/errorHandler");
const { isAdmin } = require("../services/userService");
const { HTTP_STATUS, TICKET_STATUS } = require("../constants");

exports.access = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { user } = req;
        let query = { _id: projectId}
        if(!isAdmin(user._id)) {
            Object.assign(query, { "access_users.user" : user._id })
        }
        const project = await Project.findOne(query);
        if(project) {
            next();
        } else {
            res.status(401).json({message: "Access denied for this project"})
        }
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER).json(serverError(err));
    }
    
};
