const webpackDevConfig = require('./webpack.dev');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const {
  createNotifierCallback
} = require('./utils');

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || webpackDevConfig.devServer.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      webpackDevConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      webpackDevConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${webpackDevConfig.devServer.host}:${port}`],
        },
        onErrors: createNotifierCallback(),
      }));

      resolve(webpackDevConfig);
    }
  });
})