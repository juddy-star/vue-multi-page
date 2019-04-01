const path = require('path')
const DEP_BLOCK_NAME = 'AsyncDependenciesBlock';
const {
  projectConfigMap
} = require('../../utils');

module.exports = class AsyncChunkNamePlugin {
  constructor(options = {}) {
    this.options = options;
  }
  static checkConstructorNames(object = {}) {
    const obj = Object.getPrototypeOf(object);
    if (obj) {
      if (obj.constructor.name === DEP_BLOCK_NAME) {
        return true;
      } else {
        return AsyncChunkNamePlugin.checkConstructorNames(obj);
      }
    } else {
      return false;
    }
  }
  static getChunkName(pathStr = '') {
    const dirname = path.dirname(pathStr);

    const lastSplitIndex = dirname.lastIndexOf('/');
    const lastFolderName = dirname.slice(lastSplitIndex + 1);

    const reg = /src\/pages\/([^/\\:*"<>|]+)\//;
    const matched = pathStr.match(reg) || [];
    const analiedProjectFolderName = matched[1];

    const projectName = Object.keys(projectConfigMap).find((projectName) => {
      const {
        [projectName]: {
          projectFolderName = ''
        } = {}
      } = projectConfigMap;
      return analiedProjectFolderName === projectFolderName;
    });
    if (!projectName) return `static/js/async/${lastFolderName}`;
    return `${projectName}/static/js/async/${lastFolderName}`;
  }
  apply(compiler = {}) {
    compiler.hooks.compilation.tap('AsyncChunkNamePlugin', (compilation) => {
      compilation.hooks.seal.tap('AsyncChunkNamePlugin', () => {
        compilation.modules.forEach((module) => {
          module.blocks.forEach((block) => {
            if (AsyncChunkNamePlugin.checkConstructorNames(block)) {
              block.dependencies.forEach((dependency) => {
                const pathStr = dependency.module.resource;
                const chunkName = AsyncChunkNamePlugin.getChunkName(pathStr);

                dependency.block.chunkName = chunkName;
                dependency.block.name = chunkName;
              });
            }
          });
        });
      });
    });
  }
}