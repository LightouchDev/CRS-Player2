/* eslint-disable no-empty */
// Patch and replace 'process.env.preset' property with 'preset.js' content.

const webpack = require('webpack')

let config = process.env.preset || '{}'

try {
  config = require('util').inspect(require('./preset'))
} catch (error) {}

module.exports = {
  baseUrl: '/crs-player2/',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.preset': config
      })
    ],
    resolve: {
      alias: {
        '@fortawesome/fontawesome-free-brands$': '@fortawesome/fontawesome-free-brands/shakable.es.js'
      }
    }  
  },
}