module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'standard'
  ],
  plugins: [
    'vue'
  ]
}
