
module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: [ 'jasmine' ],
    files: [
      'tmp/tests.css',
      'tmp/tests.js',
      { pattern: 'tmp/tests.js.map', included: false, watched: false, nocache: true }
    ],
    // wont work because of hoisting i think. try again when all pkgs use same karma
    // preprocessors: {
    //   '**/*.+(js|css)': [ 'sourcemap' ]
    // },
    logLevel: config.LOG_INFO,
    reporters: [ 'spec' ]
  })
}
