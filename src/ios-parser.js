var shell = require('shelljs');

var DEFINE_NOFOUND = 'NOFOUND';

// iOS工程项目路径
var _projectPath = '/Users/andy/Desktop/demo';


var projectPath = getProjectPath(_projectPath);
console.log(projectPath);

var projectPrefix = getProjectPrefix(_projectPath);
console.log(projectPrefix);

var plistPath = getProjectInfoPath(_projectPath);
console.log(plistPath);

/**
 *	获取工程项目路径
 */
function getProjectPath(searchPath) {
	// 获取工程项目路径组成元素
	var compose = getProjectCompose(searchPath);

	// 工程项目路径
	var projectPath = compose.join('/');

	return projectPath;
}

/**
 *	获取工程项目前缀名
 */
function getProjectPrefix(searchPath) {
	// 获取工程项目路径组成元素
	var compose = getProjectCompose(searchPath);

	// 工程项目全程
	var projectName = compose[compose.length - 1];

	// 工程项目前缀
	var projectPrefix = projectName.split('.')[0];

	return projectPrefix;
}

/**
 *	获取工程项目的Info.plist所在路径
 */
function getProjectInfoPath(searchPath) {
	// 获取pbxproj文件路径
	var pbxpojPath = getPbProjectCompose(searchPath).join('/');
	
	// 获取文件内容
	var content = shell.cat(projectPrefix);

//	INFOPLIST_FILE = "MEMobilityCenter/MEMobilityCenter-Info.plist";

}

/**
 *	搜索目录，获取项目配置文件路径组成元素
 */
function getPbProjectCompose(searchPath) {
	// 搜索集合 / *.pbxproj /
	var searchArray = shell.find('-R', searchPath).filter(function(file) { return file.match(/\.pbxproj$/); });

	// 主项目的配置文件路径 /主项目前缀.pbxproj/
	var pbxpojPath = filterProject(searchArray);

	// 获取失败，回调null
	if (pbxpojPath == null) {
		return [DEFINE_NOFOUND];
	};

	// 获取路径组成部分
	var pathCompose = pbxpojPath.split('/');
	
	// 回到上级目录
	pathCompose.pop();

	return pathCompose;
}

/**
 *	搜索目录，获取项目路径组成元素
 */
function getProjectCompose(searchPath) {
	// 获取路径分割元素
	var pathCompose = getPbProjectCompose(searchPath);

	// 回到上级目录
	pathCompose.pop();

	return pathCompose;
}

/**
 *	过滤主应用
 */
function filterProject(searchArray) {
	// 搜索结果为空，项目不存在
	if (searchArray.length == 0) {
		return null;
	};

	// 搜索结果只有一个，那么它就是主项目工程
	if (searchArray.length == 1) {
		return searchArray[0];
	};

	// 搜索结果大于1个，则进行过滤处理
	
	for (var i = 0; i < searchArray.length; i++) {
		// 项目路径
		var path = searchArray[i];
		// 项目内容
    	var content = shell.cat(path);
		
		// 正则表达式
		var reg = /PBXContainerItemProxy/g;
		// 是否匹配正则表达式
    	var isMatching = reg.test(content);
    	
    	if (isMatching) {
    		return path;
    	}
	}

	return null;
}


