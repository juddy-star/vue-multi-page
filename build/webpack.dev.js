const {
  NamedChunksPlugin
} = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base');
const {
  resolve,
  getProjectEntryMap,
  getPHWPConfigList,
  projectHistoryList,
} = require('./utils');
const {
  domain
} = require(resolve('src/config'));

const webpackDevConfig = {
  mode: 'development',
  entry: getProjectEntryMap('development'),
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    publicPath: `/${domain}/`,
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    hotOnly: true,
    compress: true,
    quiet: true,
    clientLogLevel: 'warning',
    disableHostCheck: true,
    // HTML5 history模式
    historyApiFallback: {
      rewrites: [].concat(projectHistoryList)
    },
    proxy: {},
  },
  module: {
    rules: [{
      test: /\.(css|less)$/,
      use: [
        'vue-style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        'postcss-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [].concat(
    // 每一个项目的htmlWebpackPlugin
    getPHWPConfigList('development').map(config => new HtmlWebpackPlugin(config))
  )
};

module.exports = merge(
  webpackBaseConfig,
  webpackDevConfig
);