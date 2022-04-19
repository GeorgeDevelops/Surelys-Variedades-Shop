const config = require('config');
const logger = require('./logger');

module.exports = function () {
    if (!config.get('defaultSettings.privateKey') || config.get('defaultSettings.privateKey') == '') {
        logger.error("FATAL ERROR: Secret key is not defined.");
        process.exit(1);
    }
}