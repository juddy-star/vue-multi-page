#!/usr/bin/env node

const program = require('commander');

const {
  resolve,
} = require('./utils');

const {
  getProjectName,
  getProjectFolderName,
  getProjectPlugins,
} = require('./inquirer');

const compile = require('./compile');

const packages = require(resolve('package.json'));

program
  .version(packages.version)
  .option('-c, --create', 'add a project(page)')
  .parse(process.argv);

// 如果是创建页面工程
if (program.create) {
  getProjectName()
    .then(getProjectFolderName)
    .then(getProjectPlugins)
    .then(compile)
}