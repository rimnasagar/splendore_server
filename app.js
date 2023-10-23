"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');

const { port, node_env, DB, build_path } = require("./config");
const CheckToken = require("./middlewares/auth");
const index = require("./routes/index");
const users = require("./routes/users");
const product = require("./routes/product");
const blog = require("./routes/blog");
const bulkadd = require("./routes/bulkadd");
const media = require("./routes/media");

const corsoption = [
    {
        origin: "http://localhost:3000",
        credentials: true,
    },
    {
        origin: "http://localhost:3000",
        credentials: true,
    },
];
const server = http.createServer(app);

// DB connection
mongoose.Promise = global.Promise;
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        () => {
            console.log("Database is connected");
        },
        (err) => {
            console.log("Cannot connect to the database" + err);
            console.log(err)
        }
    );
app.use(bodyParser.urlencoded({ extended: true, limit: "50mp" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));
    // Core options

app.use('/attachments', express.static('attachments'));
app.use(cors(corsoption));

app.use("/api/v1/", index);
app.use("/api/v1/users", CheckToken.auth, users);
app.use("/api/v1/product", product);
app.use("/api/v1/blogs", blog);
app.use("/api/v1/bulkadd", bulkadd);
app.use("/api/v1/media/", media);


  
server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});


