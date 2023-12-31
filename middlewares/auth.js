const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config");

exports.auth = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null || token == "") return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
};
