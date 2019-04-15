const ora = require('ora');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const {
  resolve,
} = require('./index');

const originPath = 'lib/template';
const destPath = 'src/pages';

/**
 * 获得目的目录相对地址
 *
 * @param {*} [options={}]
 * @returns
 */
const getDestPath = (options = {}) => {
  const {
    projectFolderName = ''
  } = options;

  return path.join(destPath, projectFolderName);
};

/**
 * 编译工程的基础信息
 * 
 * 1. config.js中的projectName
 *
 * @param {*} [options={}]
 * @returns
 */
const compileCommon = (options = {}) => {
  const {
    projectFolderName = '',
      projectName = ''
  } = options;

  const configPath = resolve(destPath, projectFolderName, 'config.js');

  const handlingConfigData = (data) => {
    return data.replace('$projectName$', projectName);
  };

  return fs.readFileAsync(configPath, 'utf-8')
    .then(handlingConfigData)
    .then(fs.writeFileAsync.bind(fs, configPath));
};

/**
 * 编译跟vue相关的信息
 * 1. router目录相关
 * 2. main.js文件相关
 * 3. config.js文件相关
 *
 * @param {*} [options={}]
 * @returns
 */
const compileVueRouter = (options = {}) => {
  const {
    projectFolderName = '',
      projectName = '',
      vuePlugins = [],
      vueRouterMode = 'hash',
  } = options;

  const routerPath = resolve(destPath, projectFolderName, 'router', 'index.js');
  const mainPath = resolve(destPath, projectFolderName, 'main.js');
  const configPath = resolve(destPath, projectFolderName, 'config.js');
  const isUsing = vuePlugins.some(plugin => plugin === 'vue-router');


  /**
   * router目录相关
   *
   * @returns
   */
  const compileRouter = () => {
    /**
     * 加工router/index.js文件
     *
     */
    const handlingData = (data) => {
      return data.replace('$projectName$', projectName);
    };

    // 需要，加工router目录下的index
    return fs.readFileAsync(routerPath, 'utf-8')
      .then(handlingData)
      .then(fs.writeFileAsync.bind(fs, routerPath));
  };

  /**
   * main.js相关
   *
   * @returns
   */
  const compileMain = () => {
    /**
     * main.js文件
     *
     */
    const handlingData = (data) => {
      if (!isUsing) return data;

      return data.replace("// import router from './router';", "import router from './router';")
        .replace('// router', 'router');
    };

    // 需要，加工router目录下的index
    return fs.readFileAsync(mainPath, 'utf-8')
      .then(handlingData)
      .then(fs.writeFileAsync.bind(fs, mainPath));
  };

  /**
   * config.js相关
   *
   * @returns
   */
  const compileConfig = () => {
    /**
     * 加工config.js文件
     *
     */
    const handlingData = (data) => {
      return data.replace('$vueRouterMode$', vueRouterMode)
    };

    // 需要，加工router目录下的index
    return fs.readFileAsync(configPath, 'utf-8')
      .then(handlingData)
      .then(fs.writeFileAsync.bind(fs, configPath));
  };


  return Promise.all([compileRouter(), compileMain(), compileConfig()]);
};

const compileVuex = (options = {}) => {
  const {
    projectFolderName,
    vuePlugins = []
  } = options;

  const mainPath = resolve(destPath, projectFolderName, 'main.js');
  const isUsing = vuePlugins.some(plugin => plugin === 'vuex');

  /**
   * main.js相关
   *
   * @returns
   */
  const compileMain = () => {
    /**
     * main.js文件
     *
     */
    const handlingData = (data) => {
      if (!isUsing) return data;

      return data.replace("// import store from './store';", "import store from './store';")
        .replace('// store', 'store');
    };

    // 需要，加工router目录下的index
    return fs.readFileAsync(mainPath, 'utf-8')
      .then(handlingData)
      .then(fs.writeFileAsync.bind(fs, mainPath));
  };

  return compileMain();
};


/**
 * 友好提示
 *
 */
const friendlyLog = (type = 'succeed', err = '') => {
  return ora(`compiling ${type} ${err && JSON.stringify(err)}`)[type]();
};

exports.originPath = originPath;

exports.getDestPath = getDestPath;

exports.compileCommon = compileCommon;

exports.compileVueRouter = compileVueRouter;

exports.compileVuex = compileVuex;

exports.friendlyLog = friendlyLog;