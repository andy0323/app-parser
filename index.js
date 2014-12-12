var iosParser = require('./src/ios-parser.js');
var androidParser = require('./src/android-parser.js');

var ios_projectPath = '/Users/andy/Desktop/demo';
var ios_version = iosParser.getProjectVersion(ios_projectPath);
console.log(ios_version);

var android_projectPath = '/Users/andy/Desktop/hell/platforms/android';
var android_version = androidParser.getProjectVersion(android_projectPath);
console.log(android_version);