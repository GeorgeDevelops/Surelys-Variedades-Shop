const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('./logger');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token || token == '') res.status(401).send("No token provided.");

    try {
        const decoded = jwt.verify(token, config.get('defaultSettings.privateKey'));
        req.user = decoded
        next();
    }
    catch (ex) {
        logger.log({level: 'error', message: Date.now() + ':' + ex})
        return res.status(400).send("Invalid token.");
    }
}