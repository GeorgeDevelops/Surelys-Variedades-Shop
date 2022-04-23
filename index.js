// Server source

const logger = require('./middlewares/logger');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const winston = require('winston');
const emitterEvent = require('events');
const emitter = new emitterEvent();
const cors = require('cors');

// Uncaught && Unhandled emitters

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

// Connection emitter

emitter.on('connection', () => {
    return logger.info("New connection...")
});

// Routes 

const signup = require('./routes/signup');
const login = require('./routes/auth');
const products = require('./routes/products');
const orders = require('./routes/orders');
const cart = require('./routes/cart');
const users = require('./routes/users');

// Middlewares

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
require('./middlewares/essentialConfig')();

//CORS 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Router 

app.use('/api', signup);
app.use('/api', login);
app.use('/api', products);
app.use('/api', orders);
app.use('/api', cart);
app.use('/api', users)

// DB connection

mongoose.connect(`${config.get('defaultSettings.db')}`).then(()=>{
    logger.log({
        level: 'info',
        message: `Successfully connected to ${config.get('defaultSettings.db')}...`
    });
});

// Server and port connection 

const port = process.env.PORT || 5000;
app.listen(port, () => {
    logger.log({
        level: 'info',
        message: 'listening on port: ' + port
    });
});

module.exports.server = app;