const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const projectUpperDir = 'src/pages/';
const projectConfigFileName = 'config.js';

const resolve = (...srcs) => {
  return path.resolve.apply(path, [__dirname, '../../'].concat(srcs));
};

/**
 * 是否是目录
 *
 * @param {string} [path='']
 * @returns
 */
const isDirectory = (path = '') => {
  if (!path) return false;

  return fs.lstatSync(path).isDirectory();
};

/**
 * 得到所有项目的文件夹名称列表
 *
 * @param {string} [projectUpperDir='']
 * @returns
 */
const getProjectFolderNameList = (projectUpperDir = '') => {
  return fs.readdirSync(resolve(projectUpperDir)).filter(name => isDirectory(resolve(projectUpperDir, name)));
};

/**
 * 是否是合法的页面文件夹
 * 主要判断文件夹名称是否重复
 *
 * @param {string} [projectFolderName='']
 * @returns
 */
const isLegalProjectFolderName = (projectFolderName = '') => {
  if (!projectFolderName) return false;

  const projectFolderNameList = getProjectFolderNameList(projectUpperDir);

  return projectFolderNameList.every(folderName => folderName !== projectFolderName);
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

/**
 * 获得所有项目的配置映射
 * 根据env的不同，获得不同的配置
 */
const getProjectConfigMap = () => {
  const projectFolderNameList = getProjectFolderNameList(projectUpperDir);

  const generateProjectConfigMap = (total = {}, projectFolderName = '') => {
    const projectConfig = getProjectConfig(projectFolderName);
    const {
      name: projectName = projectFolderName
    } = projectConfig;

    if (total[projectName]) throw new Error(`duplicate project name: ${projectName}`);

    total[projectName] = Object.assign({
        projectUpperDir,
        projectFolderName,
      },
      projectConfig
    );

    return total;
  };

  return projectFolderNameList.reduce(generateProjectConfigMap, {});
};

/**
 * 是否是合法的项目名称
 * 主要判断跟当前的项目名称是否冲突
 */
const isLegalProjectName = (projectName = '') => {
  if (!projectName) return false;

  const projectConfigMap = getProjectConfigMap();

  return Object.keys(projectConfigMap).every(key => key !== projectName);
};


/**
 * 把源目录下的所有文件或文件夹写入目的目录
 *
 * @param {string} [originPath='lib/template']
 * @param {string} [destPath='src/pages/demo']
 * @returns
 */
const writeStaffAsync = (originPath = 'lib/template', destPath = 'src/pages/demo') => {
  const absoluteOriginPath = resolve(originPath);
  const absoluteDestPath = resolve(destPath);

  /**
   * 循环目录或文件，递归进行下一步
   *
   * @param {*} [nextPaths=[]]
   * @returns
   */
  const writeStaffList = (nextPaths = []) => {
    const nextWriteStaffAsync = nextPaths.map(nextPath => writeStaffAsync(path.join(originPath, nextPath), path.join(destPath, nextPath)));

    return Promise.all(nextWriteStaffAsync);
  }

  /**
   * 文件夹类型
   * 1. 创建目录，无论创建成功与否，都进行下一步
   * 2. 读目录下的目录及文件
   * 3. 递归进行下一步
   * @returns
   */
  const writeStaffByDir = () => {
    return fs.mkdirAsync(absoluteDestPath)
      .catch()
      .then(fs.readdirAsync.bind(fs, absoluteOriginPath))
      .then(writeStaffList.bind(null));
  };

  /**
   * 文件类型，直接读写文件
   *
   * @returns
   */
  const writeStaffByFile = () => {
    return fs.readFileAsync(absoluteOriginPath)
      .then(fs.writeFileAsync.bind(fs, absoluteDestPath));
  };

  /**
   * 根据文件状态，进行分类逻辑
   * 1. 目录
   * 2. 文件
   * 
   * @param {*} [stat={}]
   * @returns
   */
  const writeStaffByStat = (stat = {}) => {
    if (stat.isDirectory()) {
      return writeStaffByDir();
    } else if (stat.isFile()) {
      return writeStaffByFile();
    }
  };

  // 读取状态 判断是文件还是文件夹
  return fs.statAsync(absoluteOriginPath)
    .then(writeStaffByStat);
};

exports.resolve = resolve;

exports.isLegalProjectFolderName = isLegalProjectFolderName;

exports.isLegalProjectName = isLegalProjectName;

exports.writeStaffAsync = writeStaffAsync;