const {
  VueLoaderPlugin
} = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AsyncChunkNamePlugin = require('./plugins/async-chunk-name-plugin');

const {
  projectAliasMap,
  projectFileLoaderMap,
  resolve
} = require('./utils');

module.exports = {
  context: process.cwd(),
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: Object.assign({
      '@': resolve('src'),
      common: resolve('src/common'),
      components: resolve('src/components'),
      directives: resolve('src/directives'),
      pages: resolve('src/pages'),
      api: resolve('src/api'),
      utils: resolve('src/utils'),
    }, projectAliasMap),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "all",
          name: "static/js/vendor",
          priority: -10,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'static/js/runtime'
    },
  },
  module: {
    rules: [{
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        include: resolve('src'),
        enforce: 'pre'
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // 当不满足limit，调用file-loader，执行name函数
          name(path = '') {
            return projectFileLoaderMap(path, 'img');
          }
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // 当不满足limit，调用file-loader，执行name函数
          name(path = '') {
            return projectFileLoaderMap(path, 'media');
          }
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // 当不满足limit，调用file-loader，执行name函数
          name(path = '') {
            return projectFileLoaderMap(path, 'fonts');
          }
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [resolve('dist')],
      dry: false,
    }),
    new AsyncChunkNamePlugin(),
    new VueLoaderPlugin(),
  ],
};