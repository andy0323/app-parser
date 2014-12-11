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

var plistInfo = getProjectInfoContent(_projectPath);
console.log(plistInfo);

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
	// 切割路径元素
	var compose = getPbProjectCompose(searchPath);
	
	// 获取pbxproj文件路径
	var pbxpojPath = compose.join('/');
	
	// 如果没有找到，那么返回未找到
	if (pbxpojPath == DEFINE_NOFOUND) {
		return DEFINE_NOFOUND;
	}

	// 获取文件内容
	var content = shell.cat(pbxpojPath);

	// 正则获取匹配plist集合
	var reg = /INFOPLIST_FILE = .*/g;
	var res = content.match(reg);

	// 设置默认plistPath路径
	var plistPath = DEFINE_NOFOUND;

	for (var i = 0; i < res.length; i++) {
		// 获取元素对象
		var obj = res[i];

		// 获取Info.plist路径
		if(obj.indexOf("Tests") == -1) {
			// 筛选数据
			obj = obj.split(' = ')[1];
			obj = obj.split(';')[0];

			plistPath = obj;
			break;
		}
	}

	compose.pop();
	compose.pop();

	// 项目路径
	var projectPath = compose.join('/');
	
	plistPath = projectPath + '/' + plistPath;

	return plistPath;
}

/**
 *	获取Info.plist内容
 */
function getProjectInfoContent(searchPath) {
	// 获取plistPath
	var plistPath = getProjectInfoPath(searchPath);

	if (plistPath == DEFINE_NOFOUND) {
		return null;
	}

	var content = shell.cat(plistPath);

	return content;
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


