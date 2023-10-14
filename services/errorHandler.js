const { SERVER_ERROR } = require("../messages");

exports.serverError = (err) => ({
    status: "error",
    error: err.toString(),
    message: SERVER_ERROR,
    result: null,
})