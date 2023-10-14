const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const {
    PASS_NOT_MATCH,
    USER_NOT_FOUND,
    LOGIN_SUCCESS,
    SERVER_ERROR,
    USER_CREATED
} = require("../../messages");
const { HTTP_STATUS, ROLE } = require("../../constants");

/**
 * @desc login function
 * @param string $data - username and passowrd
 * @return object - token and user object
 */
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(HTTP_STATUS.UN_AUTHERIZED).json({
                status: "error",
                error: {
                    status: true,
                    message: USER_NOT_FOUND,
                },
                message: USER_NOT_FOUND,
                result: null
            });
        } else {
            const passwordMatch = await bcrypt.compare(password, user?.password);
            if (passwordMatch) {
                const { _id, firstname, lastname, role, email, status } = user;
                const payload = {
                    _id, firstname, lastname, role, email, status
                };
                const options = {};
                const secret = config.ACCESS_TOKEN_SECRET;
                const token = jwt.sign(
                    payload,
                    secret,
                    options
                );
                delete user.password;
                res.status(HTTP_STATUS.OK).json({
                    status: "success",
                    error: null,
                    message: LOGIN_SUCCESS,
                    result: {
                        token,
                        user: payload
                    }
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER).json({
                    status: "error",
                    error: {
                        status: true,
                        message: PASS_NOT_MATCH,
                    },
                    message: PASS_NOT_MATCH,
                    result: null,
                });
            }
        }
    } catch (err) {
        console.log(err);

        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: {
                status: true,
                message: SERVER_ERROR,
            },
            message: SERVER_ERROR,
            result: null,
        });
    }
};

/**
 * @desc user register function
 * @param object $req.body - user form
 * @return object - user object
 */
exports.register = async (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;
    const userData = {
        firstname,
        lastname,
        email,
        display_name: `${firstname} ${lastname}`,
        password,
        role: role || ROLE.USER,
    };
    try {
        const user = await new User(userData);
        const userDetails = await user.save();
        delete userDetails.password;
        const { _id, firstname, lastname, role, email } = userDetails;
        const payload = {
            _id, firstname, lastname, role, email
        };
        const options = {};
        const secret = config.ACCESS_TOKEN_SECRET;
        const token = jwt.sign(
            payload,
            secret,
            options
        );
        res.status(HTTP_STATUS.CREATED).json({
            status: "success",
            error: null,
            message: USER_CREATED,
            result: {
                token,
                user: payload
            }
        });
    } catch (err) {
        console.log(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER).json({
            status: "error",
            error: err.toString(),
            message: "Server error",
            result: null,
        });
    }
};
