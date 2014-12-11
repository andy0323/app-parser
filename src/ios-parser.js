var shell = require('shelljs');

// 查找失败.
var DEFINE_NOFOUND = 'NOFOUND';

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
exports.getProjectPath = getProjectPath;

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
exports.getProjectPrefix = getProjectPrefix;

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
exports.getProjectInfoPath = getProjectInfoPath;

/**
 *	获取Info.plist内容
 */
function getProjectInfoContent(searchPath) {
	// 获取plistPath
	var plistPath = getProjectInfoPath(searchPath);

	if (plistPath == DEFINE_NOFOUND) {
		return DEFINE_NOFOUND;
	}

	// plist内容
	var content = shell.cat(plistPath);

	return content;
}
exports.getProjectInfoContent = getProjectInfoContent;

/**
 *	获取项目版本
 */
function getProjectVersion(searchPath) {
	// 获取Info.plist内容
	var plistContent = getProjectInfoContent(searchPath);

	if (plistContent == DEFINE_NOFOUND) {
		return DEFINE_NOFOUND;
	};

	// 搜索结果集合
	var searchSet = plistContent.match(/<key>CFBundleShortVersionString<\/key>\n.*<string>.*<\/string>/g);
	// 搜索匹配结果
	var searchResult = searchSet[0];

	// 截断获取应用版本
	searchResult = searchResult.split('<string>')[1];
	searchResult = searchResult.split('</string>')[0];

	return searchResult;
}
exports.getProjectVersion = getProjectVersion;


//===================	Helper	=====================================

/**
 *	搜索目录，获取项目配置文件路径组成元素
 */
function getPbProjectCompose(searchPath) {
	// 搜索集合 / *.pbxproj /
	var searchArray = shell.find('-R', searchPath).filter(function(file) { return file.match(/\.pbxproj$/); });

	// 主项目的配置文件路径 /主项目前缀.pbxproj/
	var pbxpojPath = filterProject(searchArray);

	// 获取失败，回调null
	if (pbxpojPath == DEFINE_NOFOUND) {
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
		return DEFINE_NOFOUND;
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

	return DEFINE_NOFOUND;
}


