const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: [ 'jasmine' ],
    files: [
      'tmp/compiled-tests/main.js',
      'tmp/compiled-tests/*.js'
    ],
    preprocessors: {
      'tmp/compiled-tests/*.js': [ 'sourcemap' ]
    },
    logLevel: config.LOG_INFO,
    reporters: [ 'spec' ]
  })
}
