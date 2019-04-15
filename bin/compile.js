const {
  writeStaffAsync,
} = require('./utils');

const {
  originPath,
  getDestPath,
  compileCommon,
  compileVueRouter,
  compileVuex,
  friendlyLog
} = require('./utils/compile');


module.exports = function (options = {}) {
  writeStaffAsync(originPath, getDestPath(options))
    .then(compileCommon.bind(null, options))
    .then(compileVueRouter.bind(null, options))
    .then(compileVuex.bind(null, options))
    .then(friendlyLog.bind(null, 'succeed'), friendlyLog.bind(null, 'fail'));
};