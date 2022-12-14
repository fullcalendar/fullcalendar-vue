
module.exports = function(config) {
  config.set({
    basePath: '.',
    plugins: [
      require('karma-jasmine'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher')
    ],
    frameworks: ['jasmine'],
    files: [
      './tests/dist/index.iife.js',
    ],
    preprocessors: {
      './tests/dist/index.iife.js': ['sourcemap']
    },
    logLevel: config.LOG_INFO,
    reporters: ['spec']
  })
}
