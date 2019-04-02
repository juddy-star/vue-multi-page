const {
  NamedChunksPlugin
} = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpackBaseConfig = require('./webpack.base');
const {
  resolve,
  getProjectEntryMap,
  projectCommonChunkMap,
  getPHWPConfigList,
} = require('./utils');
const {
  domain
} = require(resolve('src/config'));

const webpackProdConfig = {
  mode: 'production',
  entry: getProjectEntryMap('production'),
  output: {
    path: resolve('dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: `/${domain}/`
  },
  optimization: {
    splitChunks: {
      cacheGroups: Object.assign({
          commonAsync: {
            test: /src\/(?!pages)/,
            chunks: 'async',
            minChunks: 2,
            minSize: 0,
            maxAsyncRequests: 5, // 最大异步请求数， 默认5
            name: 'static/js/common/async',
            priority: 10,
          },
        },
        // 每一个项目的commonChunk
        projectCommonChunkMap
      )
    },
    minimizer: [
      new TerserJSPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [{
      test: /\.(css|less)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: false
          }
        },
        'postcss-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    })
  ].concat(
    // 每一个项目的htmlWebpackPlugin
    getPHWPConfigList('production').map(config => new HtmlWebpackPlugin(config))
  )
};

module.exports = merge(
  webpackBaseConfig,
  webpackProdConfig
);