const inquirer = require('inquirer');

const {
  isLegalProjectFolderName,
  isLegalProjectName,
} = require('./utils');

/**
 *获得项目名称
 *
 * @param {*} [preAnswers={}]
 * @returns
 */
const getProjectName = (preAnswers = {}) => {
  return inquirer
    .prompt([{
        type: 'input',
        name: 'projectName',
        message: 'please enter a project(page) name',
        validate: function (text) {
          if (!isLegalProjectName(text)) return `duplicate project(page) name: ${text}`;

          return true;
        }
      },

    ]).then((answers = {}) => Object.assign(preAnswers, answers));
}

/**
 * 获得项目文件夹名称
 *
 * @param {*} [preAnswers={}]
 * @returns
 */
const getProjectFolderName = (preAnswers = {}) => {
  const {
    projectName = ''
  } = preAnswers;

  if (!isLegalProjectFolderName(projectName)) {
    return inquirer.prompt([{
      type: 'input',
      name: 'projectFolderName',
      message: 'please enter a project(page) folder name',
      validate: function (text) {
        if (!isLegalProjectFolderName(text)) return `duplicate project(page) folder name: ${text}`;

        return true;
      }
    }]).then((answers = {}) => Object.assign(preAnswers, answers));
  }

  return inquirer.prompt([{
    type: 'confirm',
    name: 'usingPName',
    message: 'using project(page) name as project folder name ?',
  }]).then((answers = {}) => {
    const {
      usingPName = true
    } = answers;

    if (usingPName) {
      return Object.assign(preAnswers, {
        projectFolderName: preAnswers.projectName
      });
    }

    return inquirer.prompt([{
      type: 'input',
      name: 'projectFolderName',
      message: 'please enter a project(page) folder name',
      validate: function (text) {
        if (!isLegalProjectFolderName(text)) return `duplicate project(page) folder name: ${text}`;

        return true;
      }
    }]).then((answers = {}) => Object.assign(preAnswers, answers));
  });
}


/**
 * 选择使用vue的plugins
 *
 * @param {*} [preAnswers={}]
 * @returns
 */
const getProjectPlugins = (preAnswers = {}) => {
  return inquirer.prompt([{
    type: 'checkbox',
    message: 'Select vue plugins',
    name: 'vuePlugins',
    choices: [
      {
        name: 'vue-router'
      },
      {
        name: 'vuex'
      },
    ]
  }]).then((answers = {}) => {
    const { vuePlugins = [] } = answers;

    if (vuePlugins.some(plugin => plugin === 'vue-router')) {
      return inquirer.prompt([{
        type: 'list',
        message: 'Select vue-router mode',
        name: 'vueRouterMode',
        choices: [
          {
            name: 'hash'
          },
          {
            name: 'history'
          },
        ]
      }]).then((nextAnswers = {}) => Object.assign(preAnswers, answers, nextAnswers));
    }

    return Object.assign(preAnswers, answers); 
  });
}

exports.getProjectName = getProjectName;

exports.getProjectFolderName = getProjectFolderName;

exports.getProjectPlugins = getProjectPlugins;