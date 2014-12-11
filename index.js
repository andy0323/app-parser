var iosParser = require('./src/ios-parser.js');


var projectPath = '/Users/andy/Desktop/demo';

var version = iosParser.getProjectVersion(projectPath);

console.log(version);