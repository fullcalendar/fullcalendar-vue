
module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: [ 'jasmine' ],
    files: [
      'tmp/tests.css',
      'tmp/tests.js',
      { pattern: 'tmp/tests.js.map', included: false, watched: false, nocache: true }
    ]
  })
}
