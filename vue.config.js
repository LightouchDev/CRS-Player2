module.exports = {
  baseUrl: '/CRS-Player2/',
  configureWebpack: {
    resolve: {
      alias: {
        '@fortawesome/fontawesome-free-brands$': '@fortawesome/fontawesome-free-brands/shakable.es.js'
      }
    }
  }
}
