module.exports = {
  plugins: [
    require('precss')(),
    require('autoprefixer')({
      'browsers': ['> 1%', 'last 2 versions']
    }),
    require('postcss-px-to-viewport')({
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ]
}