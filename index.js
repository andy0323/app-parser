var iosParser = require('./src/ios-parser.js');
var androidParser = require('./src/android-parser.js');

exports.iosVersion     = iosParser.getProjectVersion;
exports.androidVersion = androidParser.getProjectVersion;