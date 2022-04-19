// Server source

const logger = require('./middlewares/logger');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const Fawn = require('fawn');

// Routes 

const signup = require('./routes/signup');
const login = require('./routes/auth');
const products = require('./routes/products');
const orders = require('./routes/orders');
const cart = require('./routes/cart');

// Middlewares

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

// Router 

app.use('/api', signup);
app.use('/api', login);
app.use('/api', products);
app.use('/api', orders);
app.use('/api', cart);

// DB connection

mongoose.connect('mongodb://localhost/SVS').then(()=>{
    logger.log({
        level: 'info',
        message: "Successfully connected to MongoDB..."
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


// 1. verify the queries validation on the routes is competent.
module.exports.server = app;