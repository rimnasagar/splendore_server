const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || "3002",
    DB: process.env.DB_URL || "mongodb://127.0.0.1:27017/splendore_bd",
    app: {
        name: process.env.APP_NAME,
        port: process.env.PORT || 3000,
        environment: process.env.APPLICATION_ENV,
        logpath: process.env.LOG_PATH
    },
    mongo: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
    },
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "splendore1226763",
    STORAGE_DIR: "./attachments"
};
