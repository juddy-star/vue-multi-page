const path = require('path');
const process = require('process');
const TestPlugin  = require('./plugin/test');

const cwd = process.cwd();

module.exports = {
  entry: {
    activity: path.resolve(cwd, 'src/views/activity/main.js'),
    coupons: path.resolve(cwd, 'src/views/coupons/main.js')
  },
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new TestPlugin(),
  ]
};