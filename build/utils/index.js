const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const packageConfig = require('../../package.json')

const {
  domain,
  dev: {
    whiteList = [],
    blackList = []
  } = {}
} = require('../../src/config');

const projectUpperDir = 'src/pages/';
const projectConfigFileName = 'config.js';
const projectEntryName = 'main.js';


const resolve = (...srcs) => {
  return path.resolve.apply(path, [process.cwd(), ...srcs]);
};


/**
 * 得到所有项目的文件夹名称列表
 *
 * @param {string} [projectUpperDir='']
 * @returns
 */
const getProjectFolderNameList = (projectUpperDir = '') => {
  return fs.readdirSync(projectUpperDir);
};

/**
 * 得到项目的配置json
 *
 * @param {string} [projectFolderName='']
 * @returns
 */
const getProjectConfig = (projectFolderName = '') => {
  const projectConfigPath = resolve(projectUpperDir, projectFolderName, projectConfigFileName);

  return require(projectConfigPath) || {};
};

const islegalProjectName = (projectName = '') => {
  if (!projectName) throw new Error('projectName is null');

  // 黑白名单都没有配
  if (!whiteList.length > 0 && !blackList.length > 0) return true;
  // 有配白名单, 只检查白名单
  if (whiteList.length > 0) return whiteList.some(item => item === projectName);
  // 没有配白名单，检查黑名单
  return blackList.every(item => item !== projectName);
};

/**
 * 获得所有项目的配置映射
 * 根据env的不同，获得不同的配置
 */
const getProjectConfigMap = (env = 'production') => {
  const projectFolderNameList = getProjectFolderNameList(projectUpperDir);

  const generateProjectConfigMap = (total = {}, projectFolderName = '') => {
    const projectConfig = getProjectConfig(projectFolderName);
    const {
      name: projectName = projectFolderName
    } = projectConfig;

    if (total[projectName]) throw new Error(`duplicate project name: ${projectName}`);

    // 如果是dev环境，则加入黑白名单的判断
    if (env === 'development' && !islegalProjectName(projectName)) return total;

    total[projectName] = {
      projectUpperDir,
      projectFolderName,
      ...projectConfig
    };

    return total;
  };

  return projectFolderNameList.reduce(generateProjectConfigMap, {});
};

/**
 * 获得所有项目的入口映射
 * dev和prod都用
 */
const getProjectEntryMap = (env = 'production') => {
  const projectConfigMap = getProjectConfigMap(env);
  const generateProjectEntryMap = (total = {}, projectName = '') => {
    const {
      [projectName]: {
        projectFolderName = '',
        main = projectEntryName
      } = {}
    } = projectConfigMap;
    const projectEntryPath = resolve(projectUpperDir, projectFolderName, main);

    total[`${projectName}/static/js/${projectName}`] = projectEntryPath;

    return total;
  };

  return Object.keys(projectConfigMap).reduce(generateProjectEntryMap, {});
};

/**
 * 获得所有项目的alias
 * dev和prod都用
 */
const getProjectAliasMap = () => {
  const projectConfigMap = getProjectConfigMap();
  const generateProjectAliasMap = (total = {}, projectName = '') => {
    const {
      [projectName]: {
        projectFolderName = '',
      } = {}
    } = projectConfigMap;

    total[projectName] = resolve(projectUpperDir, projectFolderName);;

    return total;
  };

  return Object.keys(projectConfigMap).reduce(generateProjectAliasMap, {});
};

/**
 * 获得所有项目的commonChunk
 * 只有prod在用
 */
const getProjectCommonChunkMap = () => {
  const projectConfigMap = getProjectConfigMap();
  const generateProjectCommonChunkMap = (total = {}, projectName = '') => {
    const {
      [projectName]: {
        projectFolderName = '',
      } = {}
    } = projectConfigMap;

    total[`${projectName}CommonAsync`] = {
      test: new RegExp(`src\\/pages\\/${projectFolderName}`),
      chunks: 'async',
      minChunks: 2,
      minSize: 0,
      maxAsyncRequests: 5, // 最大异步请求数， 默认5
      name: `${projectName}/static/js/common/async`,
      priority: 20,
    };

    total[`${projectName}CommonInitial`] = {
      test: new RegExp(`src\\/pages\\/${projectFolderName}`),
      chunks: 'initial',
      minChunks: 2,
      minSize: 0,
      maxInitialRequests: 3, // 最大初始化请求书，默认3
      name: `${projectName}/static/js/common/initial`,
      priority: 20,
    };

    return total;
  };

  return Object.keys(projectConfigMap).reduce(generateProjectCommonChunkMap, {});
};

/**
 * 获得所有项目的htmlWebpackPlugin插件的实例
 * PHWP: ProjectHtmlWebpackPlugin
 * dev和prod都用
 */
const getPHWPConfigList = (env = 'production') => {
  const projectConfigMap = getProjectConfigMap(env);
  const generatePHWPConfigList = (total = [], projectName = '') => {
    const {
      [projectName]: {
        projectFolderName = '',
      } = {}
    } = projectConfigMap;

    const config = Object.assign({
      template: resolve(projectUpperDir, projectFolderName, 'index.html'),
      filename: resolve('dist', projectName, 'index.html'),
      inject: true,
      chunksSortMode: 'dependency',
    }, env === 'production' ? {
      hash: true,
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true //是否去除空格
      },
      chunks: [
        'static/js/runtime',
        'static/js/vendor',
        `${projectName}/static/js/common/initial`,
        `${projectName}/static/js/${projectName}`
      ]
    } : {
      chunks: [
        'static/js/runtime',
        'static/js/vendor',
        `${projectName}/static/js/${projectName}`
      ]
    });

    total.push(config);

    return total;
  };

  return Object.keys(projectConfigMap).reduce(generatePHWPConfigList, []);
};

/**
 * 项目文件编译路径
 * dev和prod都用
 *
 * @param {string} [path='']
 * @param {string} [type='']
 * @returns
 */
const projectFileLoaderMap = (path = '', type = '') => {
  const projectConfigMap = getProjectConfigMap();

  // 如果不是在项目文件夹里面 则默认放入顶层的static下
  if (!/src\/pages/.test(path)) {
    return `static/${path}/[name].[hash:7].[ext]`;
  }

  const reg = /src\/pages\/(\w+)\//;
  const matched = path.match(reg);
  const folderName = matched[1] || '';
  // 如果是在项目文件夹里面
  if (folderName) {
    const projectName = Object.keys(projectConfigMap).find((projectName) => {
      const {
        [projectName]: {
          projectFolderName = ''
        } = {}
      } = projectConfigMap;

      return folderName === projectFolderName;
    });
    return `${projectName}/static/${type}/[name].[hash:7].[ext]`;
  }

  throw new Error('file path not legal');
};

/**
 * dev模式下的错误提示
 *
 * @returns
 */
const createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
    })
  }
}

/**
 * 项目的vue-router是history模式时
 * 需要rewrite的路径
 * 只有dev模式下使用
 */
const getProjectHistoryList = () => {
  const projectConfigMap = getProjectConfigMap('development');

  const generateProjectHistoryList = (total = [], projectName) => {
    const {
      [projectName]: {
        vueRouter: {
          mode = 'hash'
        } = {}
      } = {}
    } = projectConfigMap;

    if (mode === 'hash') return total;

    total.push({
      from: new RegExp(`\\/${domain}\\/${projectName}\\/(?!static)`),
      to: `/${domain}/${projectName}/index.html`
    });
    return total;
  };

  return Object.keys(projectConfigMap).reduce(generateProjectHistoryList, []);
}

exports.resolve = resolve;

exports.projectConfigMap = getProjectConfigMap();

exports.getProjectEntryMap = getProjectEntryMap;

exports.projectAliasMap = getProjectAliasMap();

exports.projectCommonChunkMap = getProjectCommonChunkMap();

exports.getPHWPConfigList = getPHWPConfigList;

exports.projectFileLoaderMap = projectFileLoaderMap;

exports.createNotifierCallback = createNotifierCallback;

exports.projectHistoryList = getProjectHistoryList();