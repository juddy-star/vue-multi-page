module.exports = {
  root: true,
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/essential',
  ],
  plugins: [
    'vue'
  ],
  env: {
    es6: true,
    browser: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: "module",
  },
  rules: {
    'no-new': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    quotes: [1, "single"],
    indent: ['warn', 2]
  }
}