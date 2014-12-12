var shell = require('shelljs');

// 查找失败.
var DEFINE_ERROR = 'DEFINE_ERROR';

/**
 *	解析XML，获取项目版本号
 */
function getProjectVersion(searchPath) {
	// 获取工程项目XML的所有内容
	var xmlContent = getProjectXmlContent(searchPath);

	if (xmlContent == DEFINE_ERROR) {
		return DEFINE_ERROR;
	}

	// 搜索结果集合
	var searchSet = xmlContent.match(/android:versionName=\".*\"/g);
	// 搜索匹配结果
	var searchResult = searchSet[0];

	// 截断获取应用版本
	searchResult = searchResult.split('\"')[1];
	searchResult = searchResult.split('\"')[0];

	return searchResult;
}
exports.getProjectVersion = getProjectVersion;

/**
 *	获取工程项目XML所有文字内容
 */
function getProjectXmlContent(searchPath) {
	// 获取XML文件路径
	var xmlPath = getProjectXmlPath(searchPath);	

	if (xmlPath == DEFINE_ERROR) {
		return DEFINE_ERROR
	}

	var xmlContent = shell.cat(xmlPath);

	return xmlContent;
}
exports.getProjectXmlContent = getProjectXmlContent;

/**
 *	获取工程项目XML路径 /AndroidManifest.xml/
 */
function getProjectXmlPath(searchPath) {
	// 主工程项目路径
	var projectPath = getProjectPath(searchPath)

	// 移除报错
	if (projectPath == DEFINE_ERROR) {
		return 
	}

	// 获取XML文件路径
	var xmlPath = projectPath + '/AndroidManifest.xml';

	return xmlPath;
}
exports.getProjectXmlPath = getProjectXmlPath;

/**
 *	获取主工程项目路径
 */
function getProjectPath(searchPath) {
	// 	获取所有主项目的配置文件
	var propertiesSet = getProjectProperties(searchPath);

	// 项目路径有误
	if (propertiesSet.length != 1) {
		return DEFINE_ERROR;
	};

	// 获取主工程配置项
	var propertiesPath = propertiesSet[0];

	// 获取路径构成部分
	var pathCompose = propertiesPath.split('/');
	
	// 通过配置项路径查找
	pathCompose.pop();

	// 主工程路径
	var projectPath = pathCompose.join('/');

	return projectPath;
}
exports.getProjectPath = getProjectPath;

/**
 *	获取所有主项目配置项 /project.properties/
 */
function getProjectProperties(searchPath) {
	// 搜索集合 /project.properties/
	var searchArray = shell.find('-R', searchPath).filter(function(file) { return file.match(/project.properties$/); });

	// 如果没有匹配内容，回调提示
	if (searchArray.length == 0) {
		return DEFINE_ERROR;
	}

	// 初始化搜搜集合
	var propertiesSet = new Array();

	// 获取主项目的配置项
	for (var i = 0; i < searchArray.length; i++) {
		// 配置项路径
		var propertiesPath = searchArray[i];
		
		// 配置项内容
		var content = shell.cat(propertiesPath);

		// 正则匹配，移除依赖配置项
		var reg = /android.library=true/;

		// 是否匹配正则
		var isMatching = reg.test(content);
		
		if (!isMatching) {
			propertiesSet.push(propertiesPath);
		}
	}

	return propertiesSet;
}