const config = require('config');

module.exports = function() {
  if (!config.get('defaultSettings.privateKey')) {
    throw new Error('FATAL ERROR: privateKey is not defined.');
  }
}