const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

const path = require("path");
const fs = require('fs');

const helmet = require("helmet");
const morgan = require("morgan");

const captinRoutes = require('./routes/captain');
const userRoutes = require('./routes/user');

const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});

app.use(helmet());
app.use(morgan("combined", {
    stream: accessLogStream
}));

app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Keep-Alive');
    next();
});

app.use('/captain', captinRoutes);
app.use('/user', userRoutes);


app.use('/', (req, res, next) => {
    res.send("<h1> Hello </h1>");
});

mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true
    }, {
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(process.env.PORT);
        // app.listen(process.env.PORT, process.env.HOST_NAME);
    })
    .catch(err => {
        console.log(err);
    })